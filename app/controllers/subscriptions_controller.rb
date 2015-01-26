class SubscriptionsController < ApplicationController
  before_filter :find_data, :only => :create

  def create
    if @subscription
      puts "UPDATE ATTRIBUTES"
      @subscription.update_attributes(params[:subscription])
    else
      @subscription = @voice.subscriptions.build(params[:subscription])
    end

    if @subscription.save
      ::NotifierMailer.subscription_confirmation(@subscription).deliver
      response = {:message => "You have subscribed to this voice. Check your inbox!"}
    else
      response = {:message => @subscription.errors.full_messages.to_sentence}
    end
    render :json => response, :layout => false
  end

  def destroy
    @subscription = Subscription.find_by_email_hash(params[:id])
    @voice = @subscription.voice
    @subscription.destroy
    flash[:notice] = "You have unsubscribed from this voice."
    redirect_to @voice
  end

  private

  def find_data
    @voice        = Voice.find(params[:subscription][:voice_id])
    @subscription = Subscription.find_by_email_and_voice_id(params[:subscription][:email], params[:subscription][:voice_id])
  end
end
