class AddSubscriptionsIndexes < ActiveRecord::Migration
  def self.up
  	add_index(:subscriptions, :email)
  	add_index(:subscriptions, :voice_id)
  	add_index(:subscriptions, :frequency)
  	add_index(:subscriptions, :email_hash)
  end

  def self.down
  	remove_index(:subscriptions, :column => :email)
  	remove_index(:subscriptions, :column => :voice_id)
  	remove_index(:subscriptions, :column => :frequency)
  	remove_index(:subscriptions, :column => :email_hash)
  end
end
