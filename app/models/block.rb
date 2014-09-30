class Block < ActiveRecord::Base
  acts_as_taggable
  acts_as_taggable_on :tags
  acts_as_list :scope => :voice

  belongs_to :voice
  has_one :chart

  BLOCK_TYPES = ['custom-image', 'clipart-image', 'chart-radial', 'chart-area', 'chart-hbars','number', 'number-custom-image', 'number-clipart']
  BLOCK_LAYOUTS = ['Left', 'Right', 'Up', 'Down']
  TOKENS = ['VOICE_ID','ID','THEME','POSITION', 'STATIC_IMAGE_URL', 'SOURCES']
  DYNAMIC_TOKENS = ['CLIPART_REF_(\d*)']

  delegate :theme, :to => :voice
  delegate :static_image_url, :to => :chart
  accepts_nested_attributes_for :chart
  attr_accessible :name, :position, :voice_id, :tag_list, :chart_attributes, :data, :sources

  scope :by_tags, lambda{ |tags| tagged_with(tags, :any => true) }

  validates_presence_of :name

  before_create :set_position

  def update_position(pos)
    insert_at(pos)
  end

  def data_parsed
    pdata = data_parse_dynamic_tokens

    TOKENS.each do |token|
      begin
      #next unless token == 'STATIC_IMAGE_URL' && JSON.parse(self.data)["type"] == 'custom_image'
      pdata = pdata.gsub token, self.send(token.downcase).to_s
      rescue
      end
    end if pdata
    pdata
  end

  private
  def data_parse_dynamic_tokens
    pdata = self.data
    # TODO: Only works for clipart, change it for support other types of dynamic tokens
    DYNAMIC_TOKENS.each do |token|
      pdata = pdata.gsub(/#{token}/){|s| clipart = Clipart.where(:id => $1); clipart.first ? clipart.first.image.url : ''}
    end if pdata
    pdata
  end

  def set_position
    self.position = self.voice.blocks.count
  end
end
