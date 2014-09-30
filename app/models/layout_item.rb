class LayoutItem < ActiveRecord::Base
  belongs_to :voice
  after_save :expire_cache

  def expire_cache
    current_connection = ConnectionAdapter.connected_to
    c = ActionController::Base.new
    c.expire_fragment("#{current_connection}_homepage")
    c.expire_fragment("#{current_connection}_admin_homepage")
  end
end
