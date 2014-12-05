class CreateSlugs < ActiveRecord::Migration
  def self.up
    create_table :slugs do |t|
      t.references :voice
      t.string :text
      t.boolean :is_default, :default => 0

      t.timestamps
    end

    voices = Voice.all

    voices.each do |voice|
      slug = voice.slug

      voice.slugs.create(:text => slug, :is_default => true)
    end

    remove_column :voices, :slug
  end

  def self.down
    drop_table :slugs
  end
end
