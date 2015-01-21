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
    
    if params[:voice][:slugs_attributes]["0"][:is_default] == "0"
        params[:voice][:slugs_attributes]["0"][:is_default] = true 
    end

    @voice = build_scoped_voice(params[:voice])
    @voice.user_id = current_user.id

    if params[:voice][:related_voices_ids]
      @voice[:related_voices_ids] = params[:voice][:related_voices_ids].join(',')
    end

    if @voice.save
      unless subdomain_present?
        User.where(:is_admin => true).each{|user| ::NotifierMailer.voice_submitted(@voice.id, user.email).deliver }
        ::NotifierMailer.voice_has_been_submitted(@voice.id).deliver
      end

      Gibbon::API.api_key = "0c65b3972885f3fb7007ba52c668568d-us1"

      # CrowdVoice followers list
      list_id = "b7a57bc096"

      # CrowdVoice followers campaigns folder
      folder_id = "48405"

      ocurrences = [
        "daily",
        "weekly",
        "biweekly",
        "monthly",
        "quarterly",
        "biannual",
        "annualy"
      ]

      ocurrences.each do |ocurrence|
        segment_name = "#{@voice.id}-#{ocurrence}"
        
        # Add the static Segment
        segment_id = Gibbon::API.lists.static_segment_add({
          :id => list_id,
          :name => segment_name,
        })["id"]

        # Create campaign for this interest group
        Gibbon::API.campaigns.create({
          :type => "regular", 
          :options => {
            :list_id => list_id, 
            :subject => "CrowdVoice #{ocurrence} Notification", 
            :from_email => "director@mideastyouth.com", 
            :from_name => "CrowdVoice Notifications", 
            :generate_text => true,
            :folder_id => folder_id
          },
          :segment_opts => {
            :saved_segment_id => segment_id
          },
          :content => {
            :html => "<html><head></head><body><h1>Foo</h1><p>Bar</p></body></html>"
          }
        });
      
      end

      redirect_to @voice, :notice => t('flash.admin.voices.create.notice')
    else
      render :new
    end
  end

  def edit
  end

  def update
    if params[:voice][:related_voices_ids]
      params[:voice][:related_voices_ids] = params[:voice][:related_voices_ids].join(',')
    end

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
    slug = Slug.find_by_text!(params[:id])
    @voice = scoped_voice.find(slug.voice_id)
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
