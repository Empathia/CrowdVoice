class ApiController < ApplicationController
  before_filter :find_voice
  respond_to :json

  def version
    respond_with :version => ApiVersion.instance.version
  end

  def data
    @version = ApiVersion.instance.version
    @events = @voice.events.includes(:related_images, :related_videos)
  end

  def images
    respond_with @event.related_images.as_json(:only => [:id, :image, :person_id])
  end

  def videos
    respond_with @event.related_videos.as_json(:only => [:id, :url, :person_id])
  end

  private

  def find_voice
    @voice = Voice.find(params[:voice_id])
  end
end
