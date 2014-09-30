class AddRealtedToField < ActiveRecord::Migration
  def self.up
    add_column :related_images, :related_to, :integer
    add_column :related_videos, :related_to, :integer
  end

  def self.down
    remove_column :related_images, :related_to
    remove_column :related_videos, :related_to
  end
end
