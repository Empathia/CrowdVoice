class AddNotificationsForHomepage < ActiveRecord::Migration
  def self.up
    create_table :notifications do |t|
      t.string :content
      t.string :url
      t.string :theme
      t.timestamps
    end
  end

  def self.down
    drop_table :notifications
  end
end
