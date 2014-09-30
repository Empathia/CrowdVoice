require 'spec_helper'

describe UsersController do

  describe "POST 'create'" do

    before do
      @user = Factory.build(:user)
    end

    def do_request(params = {})
      post :create, params.merge(:format => :json)
    end

    it "creates a new user" do
      User.should_receive(:new).with('email' => 'foo@bar.com', 'password' => 'foobarz', 'username' => 'fooz').and_return(@user)
      do_request :user => {:email => 'foo@bar.com', :password => 'foobarz', :username => 'fooz'}
    end

    context "when user saves successfully" do

      before do
        User.stub!(:new).and_return(@user)
      end

      it "responds with status ok" do
        do_request
        response.status.should == 201
      end

    end

    context "when user fails to save" do

      it "responds with status error" do
        do_request
        response.status.should == 422
      end

    end

  end

end

