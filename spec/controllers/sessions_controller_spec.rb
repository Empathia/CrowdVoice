require 'spec_helper'

describe SessionsController do

  describe "GET 'new'" do

    def do_request(params = {})
      get :new, params
    end

    it "renders new template" do
      do_request
      response.should render_template(:new)
    end

  end

  describe "POST 'create'" do
    
    def do_request(params = {})
      post :create, params.merge(:format => :json)
    end

    it "authanticates user" do
      User.should_receive(:authenticate).with('foo@bar.com', 'foobar')
      do_request :email => 'foo@bar.com', :password => 'foobar'
    end

    context "when user is found" do

      before do
        User.stub!(:authenticate).and_return(Factory(:user))
      end

      it "responds with status ok" do
        do_request
        response.status.should == 200
      end

    end

    context "when user is not found" do

      before do
        User.stub!(:authenticate).and_return(nil)
      end

      it "responds with status ok" do
        do_request
        response.status.should == 404
      end

    end

  end

  describe "GET 'destroy'" do

    def do_request(params = {})
      get :destroy, params
    end

    it "deletes user session" do
      do_request
      session[:user_id].should be_nil
    end

    it "redirects to root_path" do
      do_request
      response.should redirect_to(root_path)
    end

  end

end

