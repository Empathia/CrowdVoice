class AddActiveToEventsTable < ActiveRecord::Migration
  def self.up
    add_column :voices, :has_timeline, :boolean, :default => 0
    add_column :events, :is_event, :boolean
  end

  def self.down
    remove_column :voices, :has_timeline
    remove_column :events, :is_event
  end
end
