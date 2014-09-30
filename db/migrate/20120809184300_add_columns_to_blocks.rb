class AddColumnsToBlocks < ActiveRecord::Migration
  def self.up
    add_column :blocks, :description, :string
    add_column :blocks, :number, :string
    add_column :blocks, :alignment, :string
  end

  def self.down
    remove_column :blocks, :description
    remove_column :blocks, :number
    remove_column :blocks, :alignment
  end
end
