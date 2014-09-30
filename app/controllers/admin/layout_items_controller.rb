class Admin::LayoutItemsController < ApplicationController
  def new
    # @layout_item = Notification.new
  end

  def edit
    # @layout_item = LayoutItem.find(params[:id])
    # @notification = Notification.find(params[:id])
  end

  def create
    # @notification = Notification.new(params[:notification])
    # if @notification.save
    #   redirect_to admin_homepage_path, :notice => t('flash.admin.notifications.create')
    # else
    #   render :action => "new"
    # end
  end

  def update
    @layout_item = LayoutItem.find(params[:id])
    if params[:voice_name].empty?
      @response = 'error'
      return
    end
    if @layout_item.update_attributes(params[:layout_item]) && !params[:voice_name].empty?
      @response = 'success'
    else
      @response = 'error'
    end
  end
end
