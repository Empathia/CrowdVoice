class RelatedImagesController < ApplicationController
  def destroy
  	slug = Slug.find_by_text(params[:voice_id])
    voice = slug.voice
    @image = voice.events.find(params[:event_id]).related_images.find(params[:id])
    @image.destroy
  end
end
