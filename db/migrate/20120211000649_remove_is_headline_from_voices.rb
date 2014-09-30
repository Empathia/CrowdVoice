class RemoveIsHeadlineFromVoices < ActiveRecord::Migration
  def self.up
    remove_column :voices, :is_headline
  end

  def self.down
    add_column :voices, :is_headline, :boolean, :default => false
  end
end
