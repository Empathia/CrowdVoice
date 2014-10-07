class VoicesController < ApplicationController
  cache_sweeper :static_page_sweeper, :only => [:create, :update, :destroy]
  respond_to :html, :rss, :js, :json, :only => [:show]

  before_filter :redirect_gaza_voices, :only => [:show]
  #caches_page :show, :if => Proc.new { |c| c.request.format.rss? }

  def index
    voice = Voice.witness_gaza.last

    if voice
      redirect_to gaza_path_helper(voice)
    else
      redirect_to admin_voices_path
    end
  end

  def show
    @voice = Voice.find_by_slug!(params[:id])

    filters = params[:filters] ? params[:filters].split(',') : ['image', 'video', 'link']

    if params[:filters]
      scope = (params[:mod] ? @voice.posts.unapproved : @voice.posts.approved).by_type(filters)
    else
      scope = (params[:mod] ? @voice.posts.unapproved : @voice.posts.approved)
    end

    scope = scope.where("created_at <= ?", Date.parse(params[:start]) + 1) if params[:start]

    scope = scope.by_tags(params[:tags]) if params[:tags]

    per_page = (is_mobile? ? Setting.posts_per_page_on_mobile : Setting.posts_per_page).to_i

    query = scope.page(params[:page]).per(per_page).to_sql

    # query = scope.page(params[:page]).per(10).to_sql

    if params[:start]
      query.sub!("WHERE", "FORCE INDEX (index_posts_on_created_at) WHERE") unless params[:tags]
      query.sub!("ORDER BY id", "ORDER BY created_at") unless params[:tags]
    else
      query.sub!("WHERE", "FORCE INDEX (PRIMARY, index_posts_on_approved_and_voice_id) WHERE") unless params[:tags]
    end

    @posts = Post.find_by_sql(query)

    @blocks = @voice.blocks.map(&:data_parsed)
    
    if request.format.html? || request.format.js?
      @next_page = (params[:page].nil? ? 1 : params[:page].to_i) + 1
      #@posts_count = scope.count
    end

    if (request.format.html? || request.env["HTTP_USER_AGENT"] =~ /MSIE/)
      @votes = get_votes
      # @twitter = TwitterSearch.search(@voice.twitter_search) if @voice.twitter_search
      mod = params[:mod] ? 1 : 0
      # TODO: Slow query improve it
      @timeline = Rails.cache.fetch("#{current_connection}_timeline_for_voice_#{@voice.id}_on_#{Date.today.to_s}_#{mod}") {
         Rails.logger.info ">>>> Getting timeline for #{current_connection}_timeline_for_voice_#{@voice.id}_on_#{Date.today.to_s}"
         scope.select('posts.created_at').group_by { |p| p.created_at.beginning_of_day.to_date }.keys.group_by { |date| date.year }
      }
      Rails.cache.delete("#{current_connection}_timeline_for_voice_#{@voice.id}_on_#{Date.today.to_s}_#{mod}") if @timeline.empty?
      @timeline = ActiveSupport::OrderedHash[@timeline.sort]
    end

    if params[:post]
      post = @voice.posts.find(params[:post])
      unless @posts.include?(post)
        @posts << post
      end
    end

    respond_with(@posts, :location => @voice)
  end

  def fetch_feeds
    # TODO: Check for what is this, looks like noboy use it
    # Delayed::Job.enqueue Jobs::RssFeedJob.new
    flash[:notice] = "Application is now fetching the RSS feeds"
    redirect_to :action => 'index'
  end

  def locations
    voices = Voice.where("latitude IS NOT NULL AND TRIM(latitude) <> '' AND longitude IS NOT NULL AND TRIM(longitude) <> ''").group_by(&:location).map do |location, voices|
      voices = voices.map { |v| { :slug => v.slug, :title => v.title, :latitude => v.latitude, :longitude => v.longitude } }
      {:location => location, :voices => voices}
    end
    render :json => voices
  end

  def block_tags
    @voice = Voice.find_by_slug!(params[:voice_id])
    tags = @voice.blocks.map(&:tag_list).flatten

    render :json => tags, :layout => false
  end

  def twitter_search
    search = params[:search]
    tweets = Twitter.search(search, :count => 50).results

    render :json => tweets, :layout => false
  end

private
  def redirect_gaza_voices
    voice = Voice.find_by_slug(params[:id])

    if voice && voice.is_witness_gaza && !(request.path =~ /^\/gaza/)
      redirect_to gaza_path_helper(voice)
    elsif voice && !voice.is_witness_gaza && (request.path =~ /^\/gaza/)
      redirect_to gaza_path_helper(voice)
    end
  end

  def get_votes
    ids = @posts.map(&:id)
    votes = Vote.where("post_id in (:ids) and ((user_id != null and user_id = :user_id) or (ip_address = :ip))", {:ids => ids, :user_id => current_user, :ip => request.remote_ip})
    votes.map{|vote| { :id => vote.post_id.to_s, :positive => (vote.rating > 0) ? true : false } }
  end

end
