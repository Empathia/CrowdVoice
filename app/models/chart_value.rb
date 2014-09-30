class ChartValue < ActiveRecord::Base
  belongs_to :chart

  attr_accessible :chart_id, :name, :value

  validates_presence_of :name, :value
end
