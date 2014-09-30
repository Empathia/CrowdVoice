class AddImagesThumbsFiledsToVoices < ActiveRecord::Migration
  def self.up
    add_column :voices, :background_thumb_width, :integer
    add_column :voices, :background_thumb_height, :integer
  end

  def self.down
    remove_column :voices, :background_thumb_width
    remove_column :voices, :background_thumb_height
  end
end