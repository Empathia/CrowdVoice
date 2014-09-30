class Admin::UsersController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_required
  before_filter :find_user, :only => [:edit, :show, :update, :destroy]
  layout 'admin'

  def index
    if params[:search].present?
      @users = User.find_all_by_username(params[:search])
    else
      @users = User.page(params[:page])
    end
  end

  def show
  end

  def new
    @user = User.new
  end

  def edit
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      redirect_to admin_users_path, :notice => t('flash.admin.users.create')
    else
      render :action => "new"
    end
  end

  def search_users
    @users = User.order(:username).where("username like ? OR email like ?", "%#{params[:term]}%", "%#{params[:term]}%")
    render :json => @users.map{|u| "#{u.username}  || #{u.email}"}
    #render :json => @users.map(&:username)
  end

  def update
    if @user.custom_update_attributes(params[:user])
      redirect_to admin_users_path, :notice => t('flash.admin.users.update')
    else
      render :action => "edit"
    end
  end

  def destroy
    if @user.destroy
      redirect_to admin_users_path, :notice => t('flash.admin.users.destroy')
    else
      render :action => "edit"
    end
  end

  private

  def find_user
    @user = User.find(params[:id])
  end
end
