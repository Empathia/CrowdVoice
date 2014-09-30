class AddHomePositionToVoices < ActiveRecord::Migration
  def self.up
    add_column :voices, :home_position, :integer
  end

  def self.down
    remove_column :voices, :home_position
  end
end
