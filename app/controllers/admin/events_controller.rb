class Admin::EventsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_required
  before_filter :find_voice, :except => [:all]

  layout 'admin'

  def index
    @events = @voice.events.page(params[:page])
    @status = @voice.has_timeline? ? "De-activate" : "Activate"
  end

  def new
    @event = @voice.events.new
    @events = @voice.events.where(:is_event => false).order(:name)
  end

  def create
    @events = @voice.events.where(:is_event => false).order(:name)
    @event = @voice.events.new(params[:event])

    if @event.save
      redirect_to admin_voice_events_path, :notice => "Data Point Created"
    else
      render :action => "new"
    end
  end

  def edit
    @event = @voice.events.find(params[:id])
    @events = @voice.events.where("id <> #{@event.id} AND is_event = false")
  end

  def update
    @events = @voice.events.where(:is_event => false).order(:name)
    @event = @voice.events.find(params[:id])
    if @event.update_attributes(params[:event])
      redirect_to admin_voice_events_path, :notice => "Data Point Updated"
    else
      render :action => "edit"
    end
  end

  def destroy
    @event = @voice.events.find(params[:id])
    if @event.destroy
      redirect_to admin_voice_events_path, :notice => "Data Point Deleted"
    else
      render :action => "edit"
    end
  end

  private

  def find_voice
    @voice = Voice.find_by_slug(params[:voice_id])
  end
end
