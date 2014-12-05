class AddIndexTextToSlugs < ActiveRecord::Migration
  def self.up
  	add_index :slugs, :text, :unique => true
  end

  def self.down
  	remove_index :slugs, :column => :text
  end
end
