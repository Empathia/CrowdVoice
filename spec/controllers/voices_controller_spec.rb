require 'spec_helper'

describe VoicesController do

  describe "GET 'index'" do

    def do_request(params = {})
      get :index, params
    end

    it "redirects to the show of the first voice" do
      do_request
      response.status.should == 302
    end

  end

  describe "GET 'show'" do

    before do
      @voice = Factory(:voice)
    end

    def do_request(params = {})
      get :show, params
    end

    it "assigns voice in @voice variable" do
      do_request :id => @voice.slug
      assigns(:voice).should == @voice
    end

    it "renders show template" do
      do_request :id => @voice.slug
      response.should render_template(:show)
    end

  end

end
