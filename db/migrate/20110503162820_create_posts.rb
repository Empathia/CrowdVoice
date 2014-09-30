class CreatePosts < ActiveRecord::Migration
  def self.up
    create_table :posts do |t|
      t.belongs_to :voice
      t.belongs_to :user
      t.string :title
      t.string :description
      t.integer :positive_votes_count, :default => 0
      t.integer :negative_votes_count, :default => 0
      t.integer :overall_score,        :default => 0
      t.string :source_url
      t.string :source_type
      t.string :source_service
      t.string :image
      t.boolean :approved, :default => false
      t.timestamps
    end

    add_index :posts, :voice_id
    add_index :posts, :source_url
  end

  def self.down
    drop_table :posts
  end
end
