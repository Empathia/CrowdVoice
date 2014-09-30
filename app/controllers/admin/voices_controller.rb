class Admin::VoicesController < ApplicationController
  cache_sweeper :static_page_sweeper, :only => [:create, :update, :destroy]
  before_filter :authenticate_user!
  before_filter :find_voice, :only => [:edit, :update, :destroy, :activate_timeline]

  layout 'admin'

  cache_sweeper :voices_sweeper, :only => [:create, :update, :destroy]

  def index
    if params[:search].present?
      @voices = Voice.find_all_by_title(params[:search])
    else
      @voices = Kaminari.paginate_array(scoped_voice.all).page(params[:page])
    end

  end

  def new
    @voice = Voice.new
  end

  def create
    @voice = build_scoped_voice(params[:voice])
    @voice.user_id = current_user.id
    if @voice.save
      unless subdomain_present?
        User.where(:is_admin => true).each{|user| ::NotifierMailer.voice_submitted(@voice.id, user.email).deliver }
        ::NotifierMailer.voice_has_been_submitted(@voice.id).deliver
      end
      redirect_to @voice, :notice => t('flash.admin.voices.create.notice')
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @voice.update_attributes(params[:voice])
      redirect_to admin_voices_path, :notice => t('flash.admin.voices.update.notice')
    else
      render :edit
    end
  end

  def activate_timeline
    if @voice.has_timeline
      @voice.update_attribute(:has_timeline, 0)
      redirect_to admin_voice_events_path(@voice), :notice => "Timeline De-Activated"
    else
      @voice.update_attribute(:has_timeline, 1)
      redirect_to admin_voice_events_path(@voice), :notice => "Timeline Activated"
    end
  end

  def search_voices
    @voices = Voice.order(:title).where("title like ?", "%#{params[:term]}%")
    render :json => @voices.map(&:title)
  end

  def destroy
    @voice.destroy
    redirect_to admin_voices_path, :notice => t('flash.admin.voices.destroy.notice')
  end

  def sidebar
    @voices = Voice.non_featured.order('position')
    @archived_voices = Voice.archived.order('position')
  end

  def sort
    params[:voice].each_with_index do |id, index|
      Voice.update_all(['position=?', index+1], ['id=?', id])
    end
    expire_cache
    render :nothing => true
  end

  def expire_cache
    current_connection = ConnectionAdapter.connected_to
    c = ActionController::Base.new
    c.expire_fragment("#{current_connection}_aside_menu_bar_gaza")
    c.expire_fragment("#{current_connection}_aside_menu_bar")
  end

  private
  def find_voice
    @voice = scoped_voice.find_by_slug!(params[:id])
  end

  def build_scoped_voice(*args)
    if current_user && current_user.is_admin?
      Voice.new(*args)
    else
      current_user.voices.build(*args)
    end
  end

  def scoped_voice
    if current_user && current_user.is_admin?
      Voice.order('created_at desc')
    else
      current_user.voices.order('created_at desc')
    end
  end

end
