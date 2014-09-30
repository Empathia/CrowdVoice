class SessionsController < ApplicationController
  layout 'admin'

  def new
  end

  def create
    user = User.authenticate(params[:email], params[:password])
    if user
      session[:user_id] = user.id
      respond_to do |format|
        format.html { redirect_to admin_root_url }
        format.json { render :json => user, :status => :ok }
      end
    else
      flash.now.alert = 'Invalid Email or Password'
      respond_to do |format|
        format.html { render :new }
        format.json { render :json => {'base' => t('flash.sessions.create.invalid_login')}, :status => :not_found }
      end
    end
  end

  def reset_password
    redirect_to admin_root_path if current_user
  end

  def reset_password_notify
    user = User.find_by_email(params[:email])

    if user
      user.reset_token
      ::NotifierMailer.reset_password_instructions(user).deliver
      flash.now.notice = 'Email sent.'
    else
      flash.now.alert = 'User not found'
    end

    render :reset_password
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path
  end

end