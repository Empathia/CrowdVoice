class AddTypeToSubscriptions < ActiveRecord::Migration
  def self.up
  	add_column :subscriptions, :type, :string
  end

  def self.down
  	remove_column :subscriptions, :type
  end
end
