class Post < ActiveRecord::Base
  acts_as_taggable
  acts_as_taggable_on :tags

  belongs_to :voice
  belongs_to :user
  has_many :votes, :dependent => :destroy

  attr_accessor :image_description, :image_title, :url_check, :modify_tags

  mount_uploader :image, PostImageUploader

  validates :source_url, :presence => true,
    :uniqueness => { :case_sensitive => false },
    :format => { :with => Scrapers::Link.regexp },
    :if => :uploaded_image?
  validates :source_type, :presence => true,
    :inclusion => { :in => %w[video image link] }
  validates :source_service,
    :inclusion => { :in => %w[flickr twitpic yfrog raw youtube vimeo link], :allow_nil => true }

  scope :approved, where(:approved => true)
  scope :unapproved, where(:approved => false)
  scope :daily, where("created_at BETWEEN ? AND ?", 1.day.ago, Time.now.utc.end_of_day)
  scope :weekly, where("created_at BETWEEN ? AND ?", 1.week.ago, Time.now.utc.end_of_day)
  scope :biweekly, where("created_at BETWEEN ? AND ?", 2.weeks.ago, Time.now.utc.end_of_day)
  scope :monthly, where("created_at BETWEEN ? AND ?", 1.month.ago, Time.now.utc.end_of_day)
  scope :quarterly, where("created_at BETWEEN ? AND ?", 3.months.ago, Time.now.utc.end_of_day)
  scope :biannually, where("created_at BETWEEN ? AND ?", 6.months, Time.now.utc.end_of_day)
  scope :annually, where("created_at BETWEEN ? AND ?", 1.year.ago, Time.now.utc.end_of_day)
  scope :by_type, lambda{ |filter| where(:source_type => filter) }
  scope :by_tags, lambda{ |tags| tagged_with(tags, :any => true) }

  # TODO: move the conditions to methods
  before_validation :url_check_blank, :on => :create
  before_validation :validate_source_existance, :on => :create
  before_validation :set_source_type, :if => :validate_source_type, :on => :create
  before_validation :scrape_source, :if => :validate_scrape_source, :on => :create
  before_validation :set_defaults_strings, :on => :create

  before_save :remove_unsafe_characters
  before_create :update_source_service

  before_save :set_tags, :if => '["staging","production"].include?(Rails.env)'


  def is_blacklisted?
    puts self.inspect
    blacklist = !self.voice.blacklist.blank? ? self.voice.blacklist.split(',') : []

    blacklisted = false

    blacklist.each do |word|
      if self.source_url.include? word
        blacklisted = true
        break    
      end

      if !self.title.blank? and self.title.include? word
        blacklisted = true
        break    
      end

      if !self.description.blank? and self.description.include? word
        blacklisted = true
        break    
      end
    end

    if blacklisted
      puts "\n"
      puts "-" * 80
      puts "is blacklisted"
    end

    return blacklisted
  end

  def save
    unless is_blacklisted?
      super
    else
      errors.add(:source_url, "is blacklisted")
      return false
    end
  end

  def validate_source_existance
    if self.class.exists?(:voice_id => voice_id, :source_url => source_url) && self.new_record?
      errors.add(:source_url, "is invalid or is already taken")
      return false
    end
  end

  def self.detect_type(url)
    if ::Scrapers::Video.valid_url?(url)
      'video'
    elsif ::Scrapers::Image.valid_url?(url)
      'image'
    elsif ::Scrapers::Link.valid_url?(url)
      'link'
    end
  end

  def self.detect_service(url)
    case url
      when Scrapers::Sources::YouTube.regexp : 'YouTube'
      when Scrapers::Sources::Vimeo.regexp : 'Vimeo'
      when Scrapers::Sources::Flickr.regexp : 'Flickr'
      when Scrapers::Sources::Twitpic.regexp : 'Twitpic'
      when Scrapers::Sources::Yfrog.regexp : 'Yfrog'
      when Scrapers::Sources::RawImage.regexp : 'raw'
      else 'Link'
    end
  end

  def self.is_url_reachable?(url)
    begin
      url = URI(url)
      url.path = '/' if url.path == ''
      return false if url.relative?
      req = Net::HTTP.new(url.host, url.port)
      if url.scheme == 'https'
        req.use_ssl = true
        req.verify_mode = OpenSSL::SSL::VERIFY_NONE
      end
      res = req.head(url.path)
      if res.kind_of?(Net::HTTPRedirection)
        is_url_reachable? res['location']
      else
        res.code == '200'
      end
    rescue => e
      puts "Error: #{e}"
    end
  end

  def remote_image_url=(value)
    begin
      super
    rescue OpenURI::HTTPError
      super(Scrapers::Sources::Html::DEFAULT_IMAGE)
    end
  end

  def voted_by?(user, ip, positive_rating)
    if positive_rating
      vote = Vote.where("post_id = :id and rating > 0 and (user_id = :user or ip_address = :ip)",{:id => self.id, :user => user, :ip => ip}).pop
    else
      vote = Vote.where("post_id = :id and rating < 0 and (user_id = :user or ip_address = :ip)",{:id => self.id, :user => user, :ip => ip}).pop
    end
    vote ? true : false
  end

  def is_raw_image?
    source_type == 'image' && !(source_url =~ Scrapers::Sources::Flickr.regexp) && !(source_url =~ Scrapers::Sources::Twitpic.regexp) && !(source_url =~ Scrapers::Sources::Yfrog.regexp)
  end

  # def title
  #   read_attribute(:title).gsub("\r", '').gsub("\n", '')
  # end

  private

  def url_check_blank
    errors.add(:url_check, "Must be blank") if url_check.present?
  end

  def validate_source_type
    (source_url_changed? && !source_url.blank? && !self.class.exists?(:voice_id => voice_id, :source_url => source_url)) || image_changed?
  end

  def validate_scrape_source
    (source_url_changed? && !source_url.blank? && !self.class.exists?(:voice_id => voice_id, :source_url => source_url) && source_type.present?) || (image.present? && !tag_list_changed?)
  end

  def set_source_type
    if image.blank? || !remote_image_url.blank?
      self.source_type = self.class.detect_type(source_url)
    else
      self.source_type = 'image'
    end
    self.description = image_description if source_type == 'image'
    self.title = image_title if source_type == 'image'
  end

  def scrape_source
    if image.blank? || (image.url =~ /^https?:\/\// && !self.class.is_url_reachable?(image.url)) || source_type == "link"
      begin
        raise Scrapers::Sources::Exceptions::UnrecognizedSource unless source_type.present?
        scraper = "scrapers/#{source_type}".classify.constantize.new(source_url).scraper
      rescue Scrapers::Sources::Exceptions::UnrecognizedSource
        errors.add(:source_url, "is invalid or is already taken")
        return false
      end

      begin
        scraper.scrape do |data|
          self.title = data.title if title.blank?
          self.description = data.description if description.blank?
          if self.remote_image_url.blank? || !self.class.is_url_reachable?(self.remote_image_url)
            self.remote_image_url = data.image_url
          end
        end
      rescue Timeout::Error, StandardError
        errors.add(:source_url, :invalid)
        return false
      end
    end
  end

  def set_defaults_strings
    self.title = '(no title)' unless title.present?
    self.description = '(no description)' unless description.present?
  end

  def remove_unsafe_characters
    self.title = title.remove_unsafe if title
    self.description = description.remove_unsafe if description
  end

  def update_source_service
    self.source_service = Post.detect_service(self.source_url).downcase
  end

  def uploaded_image?
    image.blank?
  end

  def set_tags
    self.tag_list = Hyponyms.list_for(self.title).reject{|t| t.include?(' ')}[0...4] if self.new_record?
  end
end
