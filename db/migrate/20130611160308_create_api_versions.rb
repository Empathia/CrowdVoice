class CreateApiVersions < ActiveRecord::Migration
  def self.up
    create_table :api_versions do |t|
      t.string :version
      t.timestamps
    end
  end

  def self.down
    drop_table :api_versions
  end
end

