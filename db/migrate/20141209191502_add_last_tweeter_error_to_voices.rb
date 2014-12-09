class AddLastTweeterErrorToVoices < ActiveRecord::Migration
  def self.up
  	add_column :voices, :last_twitter_error, :string
  end

  def self.down
  	remove_column :voices, :last_twitter_error
  end
end
