class HomeController < ApplicationController
  layout 'page'

  def index
    @notifications = Notification.all
    @items = LayoutItem.all
    @featured = Voice.featured
    @columns = [[], [], []]
    @featured.each_with_index do |f, i|
      pos = i % 3
      @columns[pos] << f
    end
    respond_to do |format|
      format.html
      format.json { render :json => Voice.all }
      format.rss { @all_voices = Voice.featured }
    end
  end

  def enqueue_server
    user = User.find_by_auth_token(params[:token])
    if user && !user.setup
      Resque.enqueue(ServerBuilder, user.id, params[:server_name])
      render 'enqueue_server', :layout => "queue"
    else
      host = BASE_DOMAIN
      @host = params[:server_name] +'.'+ host
      @path = "http://#{@host}"
      #render 'enqueue_server', :layout => "queue"
       redirect_to @path, :notice => t('Server alredy created')
    end

  end

  def first
    user = User.first
    session[:user_id] = user.id
    respond_to do |format|
        format.html { redirect_to admin_root_url }
        format.json { render :json => user, :status => :ok }
    end
  end

  def install
    render :layout => false
  end

  def check_install
    server = Installation.find_by_name(params[:server_name])
    if server && server.setup
      host = BASE_DOMAIN
      @host = params[:server_name] +'.'+ host
      @path = "http://#{@host}"
      render :json => { :created => true, :url => @path  }
    else
      render :json => { :created => false  }
    end
  end

  def accept
    session[:pre_setup] = false
    redirect_to '/new_install', :layout => false
  end

end
