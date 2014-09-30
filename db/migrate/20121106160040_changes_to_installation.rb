class ChangesToInstallation < ActiveRecord::Migration
  def self.up
    remove_column :installations, :user_id
    add_column :installations, :email, :string
  end

  def self.down
    add_column :installations, :user_id, :integer
    remove_column :installations, :email
  end
end
