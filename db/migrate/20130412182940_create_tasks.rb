class CreateTasks < ActiveRecord::Migration
  def change
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
end
