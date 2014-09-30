class AddPositionToVoices < ActiveRecord::Migration
  def self.up
    add_column :voices, :position, :integer
  end

  def self.down
    remove_column :voices, :position
  end
end
