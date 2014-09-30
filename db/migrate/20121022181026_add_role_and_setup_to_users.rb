class AddRoleAndSetupToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :setup, :boolean
    add_column :users, :auth_token, :string
    add_column :users, :role, :string, :default => "std"
  end

  def self.down
    remove_column :users, :setup
    remove_column :users, :role
    remove_column :users, :auth_token
  end
end
