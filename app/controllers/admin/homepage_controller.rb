class Admin::HomepageController < ApplicationController
  layout 'admin'
  cache_sweeper :voices_sweeper, :only => [:update]
  before_filter :authenticate_user!

  def show
    @voices = Voice.featured
    @notifications = Notification.all
  end

  def dashboard
    @voices = Voice.all
    @items = LayoutItem.where("voice_id is not null")
    @item1 = LayoutItem.find_or_create_by_id(1)
    @item2 = LayoutItem.find_or_create_by_id(2)
    @item3 = LayoutItem.find_or_create_by_id(3)
    @item4 = LayoutItem.find_or_create_by_id(4)
    @item5 = LayoutItem.find_or_create_by_id(5)
    @item6 = LayoutItem.find_or_create_by_id(6)
    @item7 = LayoutItem.find_or_create_by_id(7)
    @item8 = LayoutItem.find_or_create_by_id(8)
    @notifications = Notification.all
  end

  def update
    @voices = Voice.featured
    @voices.each do |voice|
      voice.home_position = params[:voice].index(voice.id.to_s) + 1
      voice.save
    end
    render :nothing => true, :status => :ok
  end
end
