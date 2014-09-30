class SupportersController < ApplicationController

  def create
    voice = Voice.find(params[:voice_id])
    supporter = Supporter.find_or_initialize_by_uid_and_voice_id(params[:uid], voice.id)
    if supporter.new_record? && voice.supporters << supporter
      render :json => { :url => supporter.avatar_url, :username => supporter.username }, :status => :ok
    else
      render :json => {}, :status => :conflict
    end
  end

  def destroy
    supporter = Supporter.where(:voice_id => params[:voice_id], :uid => params[:id]).pop
    if !supporter.nil? && supporter.destroy
      render :json => { :uid => params[:id] }, :status => :ok
    else
      render :json => {}, :status => :conflict
    end
  end
end
