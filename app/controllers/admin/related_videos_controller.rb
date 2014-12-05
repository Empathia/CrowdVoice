class Admin::RelatedVideosController < ApplicationController
  def destroy
  	slug = Slug.find_by_text(params[:voice_id])
    voice = slug.voice
    @video = voice.events.find(params[:event_id]).related_videos.find(params[:id])
    @video.destroy
  end
end
