require 'spec_helper'

describe WidgetController do
  
  describe "GET 'show'" do
    before do
      @voice = Factory(:voice)
      @post = Factory(:post, :voice_id => @voice.id, :approved => true)
    end
    
    def do_request
      get :show, :id => @voice.slug
    end
    
    it "should assign voice" do
      do_request
      assigns(:voice).should == @voice
    end
    
    it "should assign approved posts" do
      do_request
      assigns(:posts).should == @voice.posts.approved
    end
    
    it "should render template show" do
      do_request
      response.should render_template(:show)
    end
    
  end
end