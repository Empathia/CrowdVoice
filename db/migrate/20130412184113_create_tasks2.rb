class CreateTasks2 < ActiveRecord::Migration
  def self.up
    create_table :tasks do |t|
      t.string :page
      t.string :url
      t.integer :from
      t.integer :to
      t.string :selector
      t.string :exclude

      t.timestamps
    end
  end
  def self.down
    drop_table :tasks
  end
end
