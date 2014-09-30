class Admin::AnnouncementsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_required, :except => [:index]
  before_filter :find_announcement, :only => [:edit, :update, :destroy]
  layout 'admin'
  
  def index
    @announcements = Announcement.page(params[:page])
  end

  def new
    @announcement = Announcement.new
  end

  def edit
  end

  def create
    @announcement = Announcement.new(params[:announcement])
    if @announcement.save
      redirect_to admin_announcements_path, :notice => t('flash.admin.announcements.create')
    else
      render :action => "new"
    end
  end

  def update
    if @announcement.update_attributes(params[:announcement])
      redirect_to admin_announcements_path, :notice => t('flash.admin.announcements.update')
    else
      render :action => "edit"
    end
  end

  def destroy
    if @announcement.destroy
      redirect_to admin_announcements_path, :notice => t('flash.admin.announcements.destroy')
    else
      render :action => "edit"
    end
  end

  private

  def find_announcement
    @announcement = Announcement.find(params[:id])
  end

end
