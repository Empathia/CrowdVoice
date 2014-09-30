class AddCaptionToRelatedImagesAndVideos < ActiveRecord::Migration
  def self.up
    add_column :related_images, :caption, :string
    add_column :related_videos, :caption, :string
  end

  def self.down
    remove_column :related_images, :caption
    remove_column :related_videos, :caption
  end
end
