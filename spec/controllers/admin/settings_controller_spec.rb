require 'spec_helper'

describe Admin::SettingsController do

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

        it "fetchs all settings" do
          Setting.should_receive(:all)
          do_request
        end

      end
      
      context "when user is not admin" do
        
        before do
          current_user.stub!(:is_admin?).and_return(false)
        end
        
        it "should redirect to root" do
          do_request
          response.should redirect_to(root_path)
        end
      end

    end

    when_not_logged_in

  end

  describe "PUT 'update'" do

    def do_request(params = {})
      @settings = {"positive_threshold" => 5, "negative_threshold" => -5, "posts" => 25}
      put :update, @settings
    end

    context "when user is logged in" do

      before do
        sign_in Factory(:user)
      end

      context "when user is admin" do

        before do
          current_user.stub!(:is_admin?).and_return(true)
        end

        it "receive new values" do
          Setting.should_receive(:update_settings)
          do_request
        end

      end
      
      context "when user is not admin" do
        
        before do
          current_user.stub!(:is_admin?).and_return(false)
        end
        
        it "should redirect to root" do
          do_request
          response.should redirect_to(root_path)
        end
      end

    end

    when_not_logged_in

  end
  
  
end
