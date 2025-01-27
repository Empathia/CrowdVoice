class CreateTweets < ActiveRecord::Migration
  def self.up
    create_table :tweets do |t|
      t.references :voice
      t.string :id_str
      t.string :text
      t.timestamps
    end
  end

  def self.down
    drop_table :tweets
  end
end
