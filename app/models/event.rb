class Event < ActiveRecord::Base
  mount_uploader :background_image, GenericImageUploader
  belongs_to :voice, :touch => true
  has_many :related_images, :dependent => :destroy
  has_many :related_videos, :dependent => :destroy
  validates_presence_of :name, :description, :event_date, :background_image
  after_save :expire_cache
  accepts_nested_attributes_for :related_images, :reject_if => lambda { |i| i[:image].blank? }, :allow_destroy => true
  accepts_nested_attributes_for :related_videos, :reject_if => lambda { |v| v[:url].blank? }, :allow_destroy => true

  def expire_cache
    current_connection = ConnectionAdapter.connected_to
    c = ActionController::Base.new
    c.expire_fragment("#{current_connection}_backstory_#{self.voice.id}")
  end
end

