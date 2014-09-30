class Admin::ClipartsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_required
  before_filter :find_clipart, :only => [:edit, :update, :destroy]
  layout 'admin'

  def index
    @cliparts = Clipart.page(params[:page])
  end

  def new
    @clipart = Clipart.new
  end

  def create
    @clipart = Clipart.new(params[:clipart])
    if @clipart.save
      redirect_to admin_cliparts_path, :notice => t('flash.admin.cliparts.create')
    else
      render :action => "new"
    end
  end

  def edit
    @clipart = Clipart.find(params[:id])
  end

  def update
    if @clipart.update_attributes(params[:clipart])
      redirect_to admin_cliparts_path, :notice => t('flash.admin.cliparts.update')
    else
      render :action => "edit"
    end
  end

  def destroy
    if @clipart.delete
      redirect_to admin_cliparts_path, :notice => t('flash.admin.cliparts.destroy')
    else
      render :action => "edit"
    end
  end

  private

  def find_clipart
    @clipart = Clipart.find(params[:id])
  end

end
