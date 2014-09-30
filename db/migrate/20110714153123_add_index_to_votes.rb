class AddIndexToVotes < ActiveRecord::Migration
  def self.up
    add_index :votes, :post_id
    add_index :votes, :user_id
  end

  def self.down
    remove_index :votes, :post_id
    remove_index :votes, :user_id
  end
end
