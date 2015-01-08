class ChangeTweetsStringToText < ActiveRecord::Migration
  def self.up
  	change_column :tweets, :text, :text
  end

  def self.down
  	change_column :tweets, :text, :string
  end
end
