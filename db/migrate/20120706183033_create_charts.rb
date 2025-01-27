class CreateCharts < ActiveRecord::Migration
  def self.up
    create_table :charts do |t|
      t.belongs_to :block
      t.string :chart_type
      t.string :static_image
      t.timestamps
    end
  end

  def self.down
    drop_table :charts
  end
end
