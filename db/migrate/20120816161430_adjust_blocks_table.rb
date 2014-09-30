class AdjustBlocksTable < ActiveRecord::Migration
  def self.up
    add_column :blocks, :data, :text
    remove_column :blocks, :number
    remove_column :blocks, :alignment
    remove_column :blocks, :description
  end

  def self.down
    remove_column :blocks, :data
    add_column :blocks, :number, :string
    add_column :blocks, :alignment, :string
    add_column :blocks, :description, :string
  end
end
