class AddApprovedToVoices < ActiveRecord::Migration
  def self.up
    add_column :voices, :approved, :boolean, :default => false
  end

  def self.down
    remove_column :voices, :approved
  end
end