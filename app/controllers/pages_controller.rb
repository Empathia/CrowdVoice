class PagesController < ApplicationController
  layout 'page'

  def about
  end

  def subscribe
    h = Hominid::API.new(APP_CONFIG[:mailchimp_key])
    email = params[:subscribe_mailchimp]
    list = h.find_list_by_name('CrowdVoice')
    id = list["id"]
    begin
      h.list_subscribe(id, email, {}, "html", false, false, false, true)
      render :json => { :created => true }
    rescue Hominid::APIError => error
      render :json => { :created => false, :error => "Error: #{error.message}" }
    end
  end

  def custom_about
    @link = @custom.about
  end

end

