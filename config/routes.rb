CrowdvoiceV2::Application.routes.draw do
  resources :installations

   resources :users, :only => [:create, :edit, :update, :destroy] do
     get :reset_password
     put :update_password
   end

   controller :static_pages do
     get 'sitemap.:format' => :sitemap, :as => :sitemap, :requirements => { :format => 'xml' }
   end

  namespace :admin do
    resources :voices, :except => [:show] do
      get :search_voices, :on => :collection
      get :sidebar, :on => :collection
      post :sort, :on => :collection
      resources :events do
        resources :related_images, :only => [:destroy]
        resources :related_videos, :only => [:destroy]
      end
      resources :blocks do
        get 'reorder', :on => :member
      end
      get 'posts' => 'posts#index'
      get 'activate_timeline', :on => :member
      put 'bulk_update' => 'posts#bulk_update'
      get 'tags_autocomplete' => 'posts#tags_autocomplete'
    end
    resources :tags, :only => [:index, :edit, :update, :destroy]
    resources :cliparts
    resources :installations do
      get 'customization', :on => :collection
      put 'update_custom', :on => :collection
    end
    resources :announcements
    resources :notifications
    resources :advanced
    resource :homepage, :only => [:show, :update], :controller => 'homepage' do
      get :dashboard
    end
    resources :users do
      collection do
        get :search_users
      end
    end
    resources :layout_items

    post 'image_preview' => 'blocks#image_preview'
    get 'blocks' => 'blocks#all'
    get 'settings' => 'settings#index', :as => :settings_index
    put 'settings' => 'settings#update', :as => :settings_update
    root :to => 'voices#index'
  end

  resources :subscriptions, :only => [:create] do
    member do
      get 'unsubscribe' => :destroy, :as => :unsubscribe
    end
  end

   get 'login' => 'sessions#new'
   get 'twitter_search' => 'voices#twitter_search'
   post 'login' => 'sessions#create'
   get 'logout' => 'sessions#destroy'
   get 'reset_password' => 'sessions#reset_password'
   post 'reset_password_notify' => 'sessions#reset_password_notify'
   post 'remote_page_info' => 'posts#remote_page_info'
   post 'notify_js_error' => 'posts#notify_js_error'

   controller :pages do
     get 'about'
     post 'subscribe'
     get 'custom_about'
   end

   # =================
   # = Widget        =
   # =================
   match "/widget/:id" => "widget#show"
   match "/new_install" => "home#install"
   match "/accept_install" => "home#accept"
   match "/install" => "home#enqueue_server"
   match "/check_install" => "home#check_install"
   match "/map" => "home#index"
   #match "/first" => "home#first"
   mount Resque::Server, :at => "/resque"
   root :to => 'home#index'

   scope "(/gaza)" do
     resources :voices, :path => "/", :only => [:index, :show] do
       get 'locations' => 'voices#locations', :constraints => { :format => 'json' }, :on => :collection
       get 'block_tags' => 'voices#block_tags'
       resources :posts, :only => [:show, :create, :destroy] do
         resources :votes, :only => [:create, :destroy], :shallow => true
       end
       resources :supporters, :only => [:create, :destroy]
     end
   end
   scope 'api', :as => 'api' do
    controller :api do
      get :version
      get :data
      get 'event/:person_id/images' => 'api#images', :as => :person_images
      get 'event/:person_id/videos' => 'api#videos', :as => :person_videos
    end
  end
end
