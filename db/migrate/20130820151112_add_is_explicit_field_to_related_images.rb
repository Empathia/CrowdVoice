class AddIsExplicitFieldToRelatedImages < ActiveRecord::Migration
  def self.up
    add_column :related_images, :is_explicit, :boolean, :default => false
  end

  def self.down
    remove_column :related_images, :is_explicit
  end
end
