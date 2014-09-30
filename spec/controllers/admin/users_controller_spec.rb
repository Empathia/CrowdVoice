require 'spec_helper'

describe Admin::UsersController do

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

        it "fetchs all users" do
          User.should_receive(:page)
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

  describe "GET 'new'" do

    def do_request(params = {})
      get :new, params
    end

    context "when user is logged in" do

      before do
        sign_in Factory(:user)
      end

      context "when user is admin" do
        
        before do
          current_user.stub!(:is_admin?).and_return(true)
        end
        
        it "instantiates a new user" do
          User.should_receive(:new)
          do_request
        end

        it "renders new template" do
          do_request
          response.should render_template(:new)
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

  describe "POST 'create'" do

    def do_request(params = {})
      post :create, params
    end

    context "when user is logged in" do

      before do
        sign_in Factory(:user)
        @user = Factory.build(:user)
      end
      
      context "when user is admin" do
        
        before do
          current_user.stub!(:is_admin?).and_return(true)
        end
        
        it "creates a new user with the given params" do
          User.should_receive(:new).with('name' => 'Approved Threshold', 'value' => 1).and_return(@user)
          do_request :user => { :name => 'Approved Threshold', :value => 1 }
        end

        context "when saves successfully" do

          before do
            User.should_receive(:new).and_return(@user)
            @user.should_receive(:save).and_return(true)
          end

          it "redirects to user path" do
            do_request
            response.should redirect_to(admin_users_path)
          end

        end

        context "when fails to save" do

          before do
            User.should_receive(:new).and_return(@user)
            @user.should_receive(:save).and_return(false)
          end

          it "renders :new template" do
            do_request
            response.should render_template(:new)
          end

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

  describe "GET 'edit'" do

    def do_request(params = {})
      get :edit, params
    end

    context "when user is logged in" do

      before do
        @user = Factory(:user)
        sign_in @user
        @user = Factory(:user)
      end

      context "when user is admin" do

        before do
          current_user.stub!(:is_admin?).and_return(true)
        end

        it "finds user" do
          User.should_receive(:find).and_return(@user)
          do_request :id => 1
        end
        
        it "renders :edit template" do
          do_request :id => 1
          response.should render_template(:edit)
        end

      end
      
      context "when user is not admin" do
        
        before do
          current_user.stub!(:is_admin?).and_return(false)
        end
        
        it "should redirect to root" do
          do_request :id => 1
          response.should redirect_to(root_path)
        end
      end

    end

    when_not_logged_in :id => 1

  end

  describe "DELETE 'destroy'" do

    def do_request(params = {})
      delete :destroy, params
    end

    context "when user is logged in" do

      before do
        @user = Factory(:user)
        sign_in @user
        @user = Factory(:user)
      end

      context "when user is admin" do

        before do
          current_user.stub!(:is_admin?).and_return(true)
        end

        it "should destroy user" do
          do_request :id => 1
          User.find_by_id(1).should == nil
        end
        
        it "redirect to users path" do
          do_request :id => 2
          response.should redirect_to(admin_users_path)
        end

      end
      
      context "when user is not admin" do
        
        before do
          current_user.stub!(:is_admin?).and_return(false)
        end
        
        it "should redirect to root" do
          do_request :id => 1
          response.should redirect_to(root_path)
        end
      end

    end

    when_not_logged_in :id => 1

  end
  
end
