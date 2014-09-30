class Voice < ActiveRecord::Base
  THEMES = APP_CONFIG[:voice_themes]
  BACKGROUND_VERSIONS = %w[square wide none]
  RESERVED = %w[images new update create edit]
  attr_accessible :title, :description, :theme, :logo_link,
    :latitude, :longitude, :location, :map_url, :twitter_search, :background, :is_witness_gaza,
    :featured, :archived, :logo, :sponsor_slogan, :sponsor, :rss_feed, :approved,
    :background_version, :square_background, :wide_background, :posts_attributes, :has_timeline

  mount_uploader :logo, LogoUploader
  mount_uploader :background, BackgroundUploader
  mount_uploader :wide_background, WideBackgroundUploader
  mount_uploader :square_background, SquareBackgroundUploader

  belongs_to :user
  has_many :layout_items
  has_many :blocks, :order => "position"
  has_many :posts, :order => 'id DESC'
  has_many :events, :dependent => :destroy, :order => 'event_date DESC'
  has_many :subscriptions, :dependent => :destroy
  has_many :supporters, :dependent => :destroy
  has_one :announcement, :dependent => :destroy

  accepts_nested_attributes_for :posts

  validates_presence_of :title, :description
  validates_inclusion_of :theme, :in => THEMES
  validates_format_of :rss_feed, :with => Scrapers::Feed.regexp, :if => :check_rss_feed
  validates_inclusion_of :background_version, :in => BACKGROUND_VERSIONS
  validates :title, :exclusion => { :in => RESERVED, :message => "\"%{value}\" is reserved word."}
  before_save :generate_slug
  before_save :reset_feed_timestamps
  before_save :ensure_gaza_approved
  after_save :add_content
  after_save :send_notification
  before_destroy :enqueue_post_deletion

  scope :approved, where(:approved => true)
  scope :unapproved, where(:approved => false)
  scope :witness_gaza, where(:is_witness_gaza => true)
  scope :not_archived, where(:archived => false)
  scope :not_witness_gaza, where(:is_witness_gaza => false)
  scope :current, not_witness_gaza.approved.not_archived
  scope :archived, approved.where(:archived => true).order('position')
  scope :featured, current.where(:featured => true).order("home_position")
  scope :non_featured, current.where(:featured => false).order('position')

  acts_as_list :column => 'home_position'

  def posts_counted_by_type
    Post.where(:voice_id => self.id).approved.group('source_type').count
  end

  def expire_cache
    current_connection = ConnectionAdapter.connected_to
    c = ActionController::Base.new
    c.expire_fragment("#{current_connection}_admin_voice_#{id}_mod")
    #c.expire_fragment("voice_#{id}_mod")
    c.expire_fragment("#{current_connection}_admin_voice_#{id}_public")
    #c.expire_fragment("voice_#{id}_public")
    c.expire_fragment("#{current_connection}_voice_#{id}_rss")
    c.expire_fragment("#{current_connection}_admin_homepage")
    c.expire_fragment("#{current_connection}_mediafeed_#{id}_mod_mobile")
    c.expire_fragment("#{current_connection}_mediafeed_#{id}_mod_other")
    c.expire_fragment("#{current_connection}_mediafeed_#{id}_public_mobile")
    c.expire_fragment("#{current_connection}_mediafeed_#{id}_public_other")
    c.expire_page("/#{slug}.rss")
  end

  def square_version?
    background_version == 'square'
  end

  def wide_version?
    background_version == 'wide'
  end

  def none_version?
    background_version == 'none'
  end

  def check_rss_feed
    rss_feed.blank? ? false : true
  end

  def is_infographic?
    blocks.size > 0
  end

  def to_param
    slug
  end

  # Builds map link.
  #
  # Takes preference for map_url attribute over building the link
  # with location.
  def map_link
    map_url.blank? ? "https://maps.google.com/?q=#{CGI::escape location}" : map_url
  end

  # Replace special caracters to their equivalents
  # and removes non word characters.
  def self.slugize(str)
    base_slug = str.downcase.strip
    base_slug.gsub!(/[\s_]/, '-')
    base_slug.gsub!(/[áä]/, 'a')
    base_slug.gsub!(/[éë]/, 'e')
    base_slug.gsub!(/[îï]/, 'i')
    base_slug.gsub!(/[óö]/, 'o')
    base_slug.gsub!(/[úü]/, 'u')
    base_slug.gsub!(/ç/, 'c')
    base_slug.gsub!(/œ/, 'ae')
    base_slug.gsub!(/ñ/, 'n')
    base_slug.gsub!(/[^\w-]/, '')
    count = 1
    while exists?(:slug => base_slug)
      count += 1
      base_slug = "#{base_slug}--#{count}"
    end
    base_slug
  end

  # Reset last timestamp of the RSS and twitter inclusion
  def reset_feed_timestamps
    if self.rss_feed_changed?
      self.last_rss = nil
    end
    if self.twitter_search_changed?
      self.last_tweet = nil
    end
  end

  # Adds new content based on rss_feed and twitter_search
  def add_content
    server = ConnectionAdapter.connected_to
    server = false if server == "crowdvoice_production"

    if self.rss_feed_changed? and not self.rss_feed.blank?
      unless Rails.env.test?
        Resque.enqueue(RssFeed, self.id, server)
      else
        self.changed_attributes.delete("rss_feed")
        ::VoiceFeeder.fetch_rss(self)
      end
    end

    if self.twitter_search_changed? and not self.twitter_search.blank?
      unless Rails.env.test?
        Resque.enqueue(RssFeed, self.id, server)
      else
        self.changed_attributes.delete("twitter_search")
        ::VoiceFeeder.fetch_tweets(self)
      end
    end
  end

  def enqueue_post_deletion
    current_connection = ActiveRecord::Base.connection.instance_variable_get("@config")[:database]
    voice_id = self.id
    Resque.enqueue(PostDeletion, voice_id, current_connection)
  end

  def send_notification
    ::NotifierMailer.voice_approved(id).deliver if approved_changed? && approved
  end

  def ensure_gaza_approved
    self.approved = true if self.is_witness_gaza
  end

  def cached_events
    Rails.cache.fetch([self.class.name, id, "events"]) do
      Rails.logger.info([self.class.name, id, "events"])
      events.includes(:related_images, :related_videos).to_a
    end
  end

  private

  def generate_slug
    self.slug = self.class.slugize(title) if title_changed? && title.present?
  end
end
