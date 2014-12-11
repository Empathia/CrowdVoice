class AddBackstoryBreadcrumbRangeToVoices < ActiveRecord::Migration
  def self.up
  	add_column :voices, :backstory_breadcrumb_range, :string, :default => "Monthly"
  end

  def self.down
  	remove_column :voices, :backstory_breadcrumb_range
  end
end
