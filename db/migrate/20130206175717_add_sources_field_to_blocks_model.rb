class AddSourcesFieldToBlocksModel < ActiveRecord::Migration
  def self.up
    add_column :blocks, :sources, :text
  end

  def self.down
    remove_column :blocks, :sources
  end
end
