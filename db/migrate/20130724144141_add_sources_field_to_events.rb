class AddSourcesFieldToEvents < ActiveRecord::Migration
  def self.up
    add_column :events, :sources, :text
  end

  def self.down
    remove_column :events, :sources
  end
end
