class AddCopyrightToPosts < ActiveRecord::Migration
  def self.up
    add_column :posts, :copyright, :string
  end

  def self.down
    remove_column :posts, :copyright
  end
end