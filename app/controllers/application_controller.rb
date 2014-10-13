class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :select_connection
  before_filter :find_voices
  after_filter :restore_connection, :if => :subdomain_present?
  before_filter :set_mailer_host
  include UrlHelper
  helper_method :current_user, :gaza_path_helper, :get_excerpt, :subdomain_present?, :current_connection

  def select_connection
    # 'SOME_PREFIX_' + is optional, but would make DBs easier to delineate
    begin
      if subdomain_present?
        ConnectionAdapter.connect_to(request.subdomain)
      else
        ConnectionAdapter.connect_to
      end
    rescue
      ConnectionAdapter.restore_connection
      redirect_to root_url(:host => request.domain, :port => request.port)
    end
  end

  def set_mailer_host
    ActionMailer::Base.default_url_options[:host] = with_subdomain(request.subdomain)
  end

  # Restore the connection to crowdvoice original site
  def restore_connection
    ConnectionAdapter.restore_connection
  end

  def current_connection
    ConnectionAdapter.connected_to
  end

  # Current logged in user's instance
  def current_user
    @current_user ||= User.find_by_id(session[:user_id]) if session[:user_id]
  end

  # Validation to get if there is a subdomain present
  def subdomain_present?
    request.subdomain.present? && request.subdomain != "www"
  end

  protected

  def is_mobile?
    request.env['HTTP_USER_AGENT'] =~ /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  end

  def find_voices
    @custom = CustomAttribute.first
    @featured_voices = Voice.featured
    @archived_voices = Voice.archived
    @non_featured_voices = Voice.non_featured
    @unapproved_voices = Voice.unapproved
    @gaza_voices = Voice.witness_gaza.where(:archived => false)
    @all_voices = (@gaza_voices + @non_featured_voices).sort {|x,y| y.created_at <=> x.created_at }
  end

  # Redirects to login path if user is not logged in
  def authenticate_user!
    unless current_user
      redirect_to login_path, :alert => t('flash.application.not_logged_in')
    end
  end

  # Requires the current logged in user to be an administrator
  def admin_required
    unless current_user.is_admin?
      redirect_to root_path, :alert => "You need to be an administrator to do this."
    end
  end

  def gaza_path_helper(voice)
    if voice.is_witness_gaza
      '/gaza'+voice_path(voice)
    else
      voice_path(voice,:all=>true)# + '?all=true'
    end
  end

  def get_excerpt(string, length)
    string = string.gsub("\r\n", '').gsub("\n", '').gsub("\r", '')
    str = string[0..length]

    if string.length > length
      str = str.split(' ')
      str = str[0...(str.length - 1)].join(' ') + '...'
    end
    
    str
  end

end
