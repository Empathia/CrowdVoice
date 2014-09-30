class Task < ActiveRecord::Base
  attr_accessible :from, :page, :to, :url, :selector, :exclude
end
