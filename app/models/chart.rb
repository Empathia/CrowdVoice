class Chart < ActiveRecord::Base
  belongs_to :block
  has_many :chart_values

  mount_uploader :static_image, BlockImageUploader

  accepts_nested_attributes_for :chart_values

  attr_accessible :block_id, :chart_values_attributes, :chart_type, :static_image, :static_image_cache

  validates_inclusion_of :chart_type, :in => Block::BLOCK_TYPES
  validates_presence_of :static_image, :if => :staticImage?

  private
  def staticImage?
    chart_type == "Custom Image"
  end
end
