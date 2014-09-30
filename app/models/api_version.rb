class ApiVersion < ActiveRecord::Base
  validates_presence_of :version

  def self.instance
    first || create(:version => '1')
  end
end
