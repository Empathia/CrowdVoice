class AddIsWitnessGazaToVoices < ActiveRecord::Migration
  def self.up
    add_column :voices, :is_witness_gaza, :boolean, :default => false
  end

  def self.down
    remove_column :voices, :is_witness_gaza
  end
end