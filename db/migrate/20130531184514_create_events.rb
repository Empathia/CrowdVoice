class CreateEvents < ActiveRecord::Migration
    def self.up
    create_table :events do |t|
      t.integer :voice_id
      t.string :name
      t.text :description
      t.string :background_image
      t.date :event_date
      t.timestamps
    end
  end

  def self.down
    drop_table :events
  end
end
