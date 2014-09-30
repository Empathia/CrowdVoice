class RelatedImagesController < ApplicationController
  def destroy
    voice = Voice.find_by_slug(params[:voice_id])
    @image = voice.events.find(params[:event_id]).related_images.find(params[:id])
    @image.destroy
  end
end
