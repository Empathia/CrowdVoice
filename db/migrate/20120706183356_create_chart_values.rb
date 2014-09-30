class CreateChartValues < ActiveRecord::Migration
  def self.up
    create_table :chart_values do |t|
      t.belongs_to :chart
      t.string :name
      t.string :value
      t.timestamps
    end
  end

  def self.down
    drop_table :chart_values
  end
end
