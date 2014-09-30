class CreateVoices < ActiveRecord::Migration
  def self.up
    create_table :voices do |t|
      t.string :title
      t.text :description
      t.string :theme
      t.belongs_to :user
      t.string :slug
      t.string :logo
      t.string :logo_link
      t.string :sponsor_slogan
      t.string :sponsor
      t.string :background
      t.string :background_copyright
      t.string :latitude
      t.string :longitude
      t.string :location
      t.string :map_url
      t.string :twitter_search
      t.boolean :featured, :default => false
      t.boolean :archived, :default => false
      t.string :rss_feed
      t.datetime :last_rss
      t.datetime :last_tweet
      t.timestamps
    end

    add_index :voices, :user_id
    add_index :voices, :featured
  end

  def self.down
    drop_table :voices
  end
end
