class Admin::PostsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_required
  before_filter :find_voice, :only => [:tags_autocomplete, :index, :bulk_update]
  layout 'admin'

  def index
    @posts = @voice.posts.approved.page(params[:page])
  end

  def bulk_update
    params[:voice][:posts].reject!{|k,v| v['modify_tags'] == '0' } if params[:voice]
    params[:voice][:posts].reject!{|k, v| Post.find(k).tag_list.join(', ') == v["tag_list"] } if params[:voice] && !params[:tags].present?
    params[:voice][:posts].each{|p| p[1][:tag_list] = [p[1][:tag_list].split(' '), params['tags'].split(' ')].join(",") } if params[:voice] && params[:tags].present?

    @posts = Post.update(params[:voice][:posts].keys, params[:voice][:posts].values).reject { |p| p.errors.empty? } if params[:voice]

    if @posts && @posts.empty?
      redirect_to admin_voice_posts_url(@voice), :notice => "Posts tags updated"
    else
      redirect_to admin_voice_posts_url(@voice), :notice => "There was an error"
    end
  end

  def tags_autocomplete
    tags = ActsAsTaggableOn::Tagging.select("tags.name")\
            .joins(:tag)\
            .where({
                :context => 'tags',
                :taggable_type => 'Post',
                :taggable_id => @voice.posts.map(&:id) })\
            .where('LOWER(tags.name) like ?', "%#{params[:q]}%")\
            .group('tags.name')\
            .order('tags.name')

    render :json => tags.map{|tag| {:id => 0, :name => tag.name}}, :layout => false
  end

  private

  def find_voice
    slug = Slug.find_by_text(params[:voice_id])
    @voice = slug.voice
  end
end
