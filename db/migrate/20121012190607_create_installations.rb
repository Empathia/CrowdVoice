class CreateInstallations < ActiveRecord::Migration
  def self.up
    create_table :installations do |t|
      t.string :name
      t.belongs_to :user
      t.boolean :setup

      t.timestamps
    end
  end

  def self.down
    drop_table :installations
  end
end
