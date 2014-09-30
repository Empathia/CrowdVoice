class CreateRelatedVideos < ActiveRecord::Migration
  def self.up
    create_table :related_videos do |t|
      t.string :url
      t.belongs_to :event
      t.timestamps
    end
    add_index :related_videos, :event_id
  end
  def self.down
    drop_table :related_videos
    remove_index :related_videos, :event_id
  end
end
