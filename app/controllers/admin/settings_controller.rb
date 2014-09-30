class Admin::SettingsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_required
  layout 'admin'

  def index
    @settings = Setting.all
  end

  def update
    settings = (params[:posts].to_i >= 25) && Setting.update_settings(params)

    if settings
      redirect_to admin_settings_index_path, :notice => t('flash.admin.settings.update')
    else
      render :action => "index", :locals => { :errors => "Posts per page can't be less than 25." }
    end
  end

  private

  def find_setting
    @setting = Setting.find(params[:id])
  end

end