class AddPositionColumnToBlocks < ActiveRecord::Migration
  def self.up
    add_column :blocks, :position, :string
  end

  def self.down
    remove_column :blocks, :position
  end
end
