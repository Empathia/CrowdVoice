class AddIsExplicitToRelatedVideos < ActiveRecord::Migration
  def self.up
  	add_column :related_videos, :is_explicit, :boolean, :default => false
  end

  def self.down
  	remove_column :related_videos, :is_explicit
  end
end
