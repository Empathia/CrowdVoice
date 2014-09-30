class UsersController < ApplicationController
  respond_to :json, :only => [:create]

  layout 'admin', :only => [:reset_password, :update_password]

  def create
    @user = User.new(params[:user])
    server = params[:user][:server_name]
    if @user.save
      if server.present?
        @user.create_auth_token
        ::NotifierMailer.installation_mail(@user, server).deliver
        #temp
        logger.info("link      /install?token=#{@user.auth_token}&server_name=#{server}")
        status = :ok
        session[:pre_setup] = true
      else
        session[:user_id] = @user.id
        ::NotifierMailer.sign_up_mail(@user).deliver
        status = :ok
      end
    else
      status = :unprocessable_entity
      message = ""
    end
    respond_with(@user, :status => status, :content_type => "text/plain")
  end

  def reset_password
    @user = User.find_by_id_and_reset_password_token(params[:user_id], params[:reset_password_token])
  end

  def update_password
    @user = User.find_by_id_and_reset_password_token(params[:user_id], params[:user][:reset_password_token])

    if @user && @user.update_attributes(params[:user])
      @user.reset_token
      session[:user_id] = @user.id
      redirect_to admin_root_url
    else
      render :reset_password
    end
  end

  def create_installation(token, name)
    @user = User.find_by_auth_token(token)
    if @user.installation.nil?
      installation = DataMover.new(@user, name)
      installation.run

      # TODO: Check for what is this, it is the need to login the new user
      # session[:user_id] = @user.id
    end
    redirect_to root_url
  end
end
