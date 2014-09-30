require 'spec_helper'

describe Admin::AnnouncementsController do

  describe "GET 'index'" do

    def do_request(params = {})
      get :index, params
    end

    context "when user is logged in" do

      before do
        sign_in Factory(:user)
      end


      before do
        current_user.stub!(:is_admin?).and_return(true)
      end

      it "fetchs all announcements" do
        Announcement.should_receive(:page)
        do_request
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
        
        it "instantiates a new announcement" do
          Announcement.should_receive(:new)
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
        @announcement = Factory.build(:announcement)
      end
      
      context "when user is admin" do
        
        before do
          current_user.stub!(:is_admin?).and_return(true)
        end
        
        it "creates a new announcement with the given params" do
          Announcement.should_receive(:new).with('title' => 'Announcement Title', 'content' => 'Announcement Content').and_return(@announcement)
          do_request :announcement => { :title => 'Announcement Title', :content => 'Announcement Content' }
        end

        context "when saves successfully" do

          before do
            Announcement.should_receive(:new).and_return(@announcement)
            @announcement.should_receive(:save).and_return(true)
          end

          it "redirects to announcement path" do
            do_request
            response.should redirect_to(admin_announcements_path)
          end

        end

        context "when fails to save" do

          before do
            Announcement.should_receive(:new).and_return(@announcement)
            @announcement.should_receive(:save).and_return(false)
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
        @announcement = Factory(:announcement)
      end

      context "when user is admin" do

        before do
          current_user.stub!(:is_admin?).and_return(true)
        end

        it "finds announcement" do
          Announcement.should_receive(:find).and_return(@announcement)
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
        @announcement = Factory(:announcement)
      end

      context "when user is admin" do

        before do
          current_user.stub!(:is_admin?).and_return(true)
        end

        it "should destroy announcement" do
          do_request :id => 1
          Announcement.find_by_id(1).should == nil
        end
        
        it "redirect to announcements path" do
          do_request :id => 2
          response.should redirect_to(admin_announcements_path)
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