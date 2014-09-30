class CreateRelatedImages < ActiveRecord::Migration
  def self.up
    create_table :related_images do |t|
      t.string :image
      t.belongs_to :event
      t.timestamps
    end
    add_index :related_images, :event_id
  end
  def self.down
    drop_table :related_images
    remove_index :related_images, :event_id
  end
end
