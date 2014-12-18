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
    slug   = Slug.find_by_text!(params[:id])

    @voice = slug.voice

    scope = (params[:mod] ? @voice.posts.unapproved.where(["created_at > ?", 1.year.ago ]) : @voice.posts.approved)

    query = scope.includes(:tags).to_sql

    @posts = Post.find_by_sql(query)

    @tweets = @voice.tweets.limit(100)

    if request.format.html?
      @blocks = @voice.blocks.map(&:data_parsed)
    end

    if (request.format.html? || request.env["HTTP_USER_AGENT"] =~ /MSIE/)
      @votes = get_votes
    end

    if params[:post]
      post = @voice.posts.find(params[:post])
      unless @posts.include?(post)
        @posts << post
      end
    end

    if request.format.html?
      respond_with(@posts, :location => @voice)
    else
      posts_ids = @posts.map(&:id)

      @tags = ActsAsTaggableOn::Tagging.includes(:tag).where(:taggable_id => posts_ids).map { |tagging|
        name = 'none'

        if tagging.tag
          name = tagging.tag.name
        end

        {
          :id => tagging.taggable_id,
          :name => name
        }
      }

      response = {
        # :tags => Oj.dump(@tags, :mode => :compat),
        :tags => @tags,
        :posts => ActiveRecord::Base.connection.execute(query),
        :timeline => @timeline
      }

      render :json => Oj.dump(response, :mode => :compat), :layout => false
    end


  end

  def fetch_feeds
    # TODO: Check for what is this, looks like noboy use it
    # Delayed::Job.enqueue Jobs::RssFeedJob.new
    flash[:notice] = "Application is now fetching the RSS feeds"
    redirect_to :action => 'index'
  end

  def locations
    voices = Voice.find_by_sql("SELECT *, CONCAT(TRUNCATE(latitude, 1), ',', TRUNCATE(longitude, 1)) AS latlong FROM voices").group_by(&:latlong).map do |coords, voices|
      voices = voices.map { |v| {
        :default_slug => v.default_slug,
        :title => v.title,
        :latitude => v.latitude,
        :longitude => v.longitude,
        :theme => v.theme,
        :is_infographic => v.is_infographic?,
        :is_backstory => !subdomain_present? && v.has_timeline,
        :topic => v.topic
      }}
      {:coordinates => coords, :voices => voices}
    end
    render :json => voices
  end

  def block_tags
    slug = Slug.find_by_text!(params[:voice_id])
    @voice = slug.voice
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
    slug  = Slug.find_by_text!(params[:id])
    voice = slug.voice

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
