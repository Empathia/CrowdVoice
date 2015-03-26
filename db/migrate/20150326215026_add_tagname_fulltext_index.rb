class AddTagnameFulltextIndex < ActiveRecord::Migration
  def self.up
  	add_index :tags, :name, :name => 'fulltext_name', :type => :fulltext
  end

  def self.down
  	remove_index(:tags, :name => 'fulltext_name')
  end
end
