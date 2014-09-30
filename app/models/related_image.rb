class RelatedImage < ActiveRecord::Base
  mount_uploader :image, GenericImageUploader
  belongs_to :event
end
