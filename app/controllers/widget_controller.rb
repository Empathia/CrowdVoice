class WidgetController < ApplicationController
  before_filter :get_size_params, :only => [:show]

  def index
    @voices = Voice.featured
  end

  def show
    if @scope_this = (params[:scope] != 'all')
      slug = Slug.find_by_text!(params[:id])
      @voice = slug.voice
      filter_posts = @voice.posts.approved.limit(50)
      @posts = filter_posts
    else
      @voices = Voice.approved.featured
    end
    @rtl = params[:rtl] == '1' ? true : false
    respond_to do |format|
      format.html
    end
  end

  private

  def get_size_params
    @list_height_size = case params[:size]
      when "small"
        "small-list"
      when "medium"
        "medium-list"
      when "tall"
        "tall-list"
      end

    width_size = get_width(params[:width])

    case width_size
    when "small"
      @post_image_size = "42x42"
      @voice_image_size = "42x42"
      @list_width_size = "small-size"
    when "default"
      @post_image_size = "55x55"
      @voice_image_size = "65x65"
      @list_width_size = "default-size"
    end
  end

  def get_width(width)
    size = "default"
    unless width.nil?
      if width == "small" || width.to_i <= 200
        size = "small"
      end
    end
    size
  end

end
