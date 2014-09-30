require 'spec_helper'

describe Admin::VoicesController do

  describe "GET 'index'" do

    def do_request(params = {})
      get :index, params
    end

    context "when user is logged in" do

      before do
        sign_in Factory(:user)
      end

      context "when user is admin" do

        before do
          current_user.stub!(:is_admin?).and_return(true)
        end

        it "fetchs all voices" do
          Voice.should_receive(:order).and_return(Voice.scoped)
          do_request
        end

      end

      it "fetchs user's voices" do
        current_user.voices.should_receive(:order).and_return(Voice.scoped)
        do_request
      end

      it "renders index template" do
        do_request
        response.should render_template(:index)
      end

    end

    when_not_logged_in

  end

  describe "GET 'new'" do

    def do_request(params = {})
      get :new, params
    end

    context "when user is logged in" do

      before do
        sign_in Factory(:user)
      end

      it "instantiates a new voice" do
        Voice.should_receive(:new)
        do_request
      end

      it "renders new template" do
        do_request
        response.should render_template(:new)
      end

    end

    when_not_logged_in

  end

  describe "POST 'create'" do

    def do_request(params = {})
      post :create, params
    end

    context "when user is logged in" do

      before do
        sign_in Factory(:user)
        @voice = Factory.build(:voice)
      end

      it "creates a new voice with the given params" do
        Voice.should_receive(:new).with('title' => 'foo', 'content' => 'bar').and_return(@voice)
        do_request :voice => { :title => 'foo', :content => 'bar' }
      end

      context "when saves successfully" do

        before do
          Voice.should_receive(:new).and_return(@voice)
          @voice.should_receive(:save).and_return(true)
        end

        it "redirects to voice path" do
          do_request
          response.should redirect_to(@voice)
        end

      end

      context "when fails to save" do

        before do
          Voice.should_receive(:new).and_return(@voice)
          @voice.should_receive(:save).and_return(false)
        end

        it "renders :new template" do
          do_request
          response.should render_template(:new)
        end

      end

    end

    when_not_logged_in

  end

  describe "GET 'edit'" do

    def do_request(params = {})
      get :edit, params
    end

    context "when user is logged in" do

      before do
        @user = Factory(:user)
        sign_in @user
        @voice = Factory(:voice)
      end

      context "when user is admin" do

        before do
          current_user.stub!(:is_admin?).and_return(true)
        end

        it "finds voice from all voices" do
          Voice.should_receive(:find_by_slug).and_return(@voice)
          do_request :id => @voice.slug
        end

      end

      it "renders :edit template" do
        current_user.stub!(:voices).and_return(Voice.scoped)
        current_user.voices.should_receive(:find_by_slug).and_return(@voice)
        do_request :id => @voice.slug
        response.should render_template(:edit)
      end

    end

    when_not_logged_in :id => 1

  end

end
