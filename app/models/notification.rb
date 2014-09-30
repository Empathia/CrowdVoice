class Notification < ActiveRecord::Base
  validates :content, :presence => true
  validates :theme, :presence => true
  validates :url, :format => { :with => URI.regexp(%w[http https]), :allow_nil => true }

  after_save :expire_cache
  after_destroy :expire_cache

  def expire_cache
    current_connection = ConnectionAdapter.connected_to
    c = ActionController::Base.new
    c.expire_fragment("#{current_connection}_homepage")
  end
end
