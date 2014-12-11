class AddBlacklistToVoices < ActiveRecord::Migration
  def self.up
  	add_column :voices, :blacklist, :text, :default => ""
  end

  def self.down
  	remove_column :voices, :blacklist
  end
end
