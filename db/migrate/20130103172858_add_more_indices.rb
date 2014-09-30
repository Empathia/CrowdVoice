class AddMoreIndices < ActiveRecord::Migration
  def self.up
    add_index :posts, [:approved, :voice_id]
  end

  def self.down
    remove_index :posts, [:approved, :voice_id]
  end
end
