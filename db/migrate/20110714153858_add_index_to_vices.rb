class AddIndexToVices < ActiveRecord::Migration
  def self.up
    add_index :voices, :is_witness_gaza
  end

  def self.down
    remove_index :voices, :is_witness_gaza
  end
end
