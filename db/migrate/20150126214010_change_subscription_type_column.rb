class ChangeSubscriptionTypeColumn < ActiveRecord::Migration
  def self.up
  	rename_column :subscriptions, :type, :frequency
  end

  def self.down
  	rename_column :subscriptions, :frequency, :type
  end
end
