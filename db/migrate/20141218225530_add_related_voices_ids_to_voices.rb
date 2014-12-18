class AddRelatedVoicesIdsToVoices < ActiveRecord::Migration
  def self.up
  	add_column :voices, :related_voices_ids, :string, :default => nil
  end

  def self.down
  	remove_column :voices, :related_voices_ids
  end
end
