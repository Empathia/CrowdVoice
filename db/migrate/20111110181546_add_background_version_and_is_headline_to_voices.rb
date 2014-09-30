class AddBackgroundVersionAndIsHeadlineToVoices < ActiveRecord::Migration
  def self.up
    add_column :voices, :background_version, :string, :default => 'square'
    add_column :voices, :is_headline, :boolean, :default => false
  end

  def self.down
    remove_column :voices, :is_headline
    remove_column :voices, :background_version
  end
end
