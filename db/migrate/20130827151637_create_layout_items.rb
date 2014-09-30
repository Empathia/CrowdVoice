class CreateLayoutItems < ActiveRecord::Migration
  def self.up
    create_table :layout_items do |t|
      t.integer :voice_id
      t.string :item_type
      t.integer :order

      t.timestamps
    end
  end

  def self.down
    drop_table :layout_items
  end
end
