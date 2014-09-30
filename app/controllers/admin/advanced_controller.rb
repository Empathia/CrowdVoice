class Admin::AdvancedController < ApplicationController
  layout 'admin'
  before_filter :admin_required
  cache_sweeper :voices_sweeper, :only => [:update]

  def index
    
  end
end
