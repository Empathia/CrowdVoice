class CreateSupporters < ActiveRecord::Migration
  def self.up
    create_table :supporters do |t|
      t.belongs_to :voice
      t.string :uid
      t.timestamps
    end

    add_index :supporters, :uid
    add_index :supporters, :voice_id
  end

  def self.down
    drop_table :supporters
  end
end
