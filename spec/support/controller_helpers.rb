module ControllerHelpers

  def self.included(base)
    base.extend SingletonMethods
  end

  def sign_in(user)
    session[:user_id] = user.id
  end

  def current_user
    controller.current_user
  end


  module SingletonMethods

    def when_not_logged_in(params = {})
      context "when user is not logged in" do

        it "redirects you to sign in path" do
          do_request params
          response.should redirect_to(login_path)
        end

      end
    end

  end

end
