class AddBlacklistToVoices < ActiveRecord::Migration
  def self.up
  	add_column :voices, :blacklist, :text
  end

  def self.down
  	remove_column :voices, :blacklist
  end
end
