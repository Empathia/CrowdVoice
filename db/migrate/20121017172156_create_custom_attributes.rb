class CreateCustomAttributes < ActiveRecord::Migration
  def self.up
    create_table :custom_attributes do |t|
      t.string :name
      t.string :logo
      t.string :twitter
      t.string :facebook
      t.string :title
      t.string :about

      t.timestamps
    end
  end

  def self.down
    drop_table :custom_attributes
  end
end
