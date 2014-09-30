class Admin::RelatedVideosController < ApplicationController
  def destroy
    voice = Voice.find_by_slug(params[:voice_id])
    @video = voice.events.find(params[:event_id]).related_videos.find(params[:id])
    @video.destroy
  end
end
