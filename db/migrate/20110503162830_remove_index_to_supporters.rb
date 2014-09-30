class RemoveIndexToSupporters < ActiveRecord::Migration
  def self.up
    remove_index :supporters, :uid
    add_index :supporters, :uid
  end

  def self.down
  end
end