class AddTopicToVoice < ActiveRecord::Migration
  def self.up
  	add_column :voices, :topic, :string, :default => ""
  end

  def self.down
  	remove_column :voices, :topic
  end
end
