class Clipart < ActiveRecord::Base

  mount_uploader :image, BlockImageUploader

  attr_accessible :name, :image, :active, :image_cache
end
