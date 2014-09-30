class Admin::NotificationsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_required, :except => [:index]
  layout 'admin'

  def index
    @notifications = Notification.page(params[:page])
  end

  def new
    @notification = Notification.new
  end

  def edit
    @notification = Notification.find(params[:id])
  end

  def create
    @notification = Notification.new(params[:notification])
    if @notification.save
      redirect_to admin_homepage_path, :notice => t('flash.admin.notifications.create')
    else
      render :action => "new"
    end
  end

  def update
    @notification = Notification.find(params[:id])
    if @notification.update_attributes(params[:notification])
      redirect_to admin_homepage_path, :notice => t('flash.admin.notifications.update')
    else
      render :action => "edit"
    end
  end

  def destroy
    @notification = Notification.find(params[:id])
    if @notification.destroy
      redirect_to admin_homepage_path, :notice => t('flash.admin.notifications.destroy')
    else
      render :action => "edit"
    end
  end

  private

end
