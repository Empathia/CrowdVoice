class AddUsernameToSupporters < ActiveRecord::Migration
  def self.up
    add_column :supporters, :username, :string
  end

  def self.down
    remove_column :supporters, :username
  end
end
