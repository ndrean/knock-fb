  Rails.application.routes.draw do
    namespace :api do
      namespace :v1 do
        resources :users, only: [:index, :show, :profile]
        post '/getUserToken', to: 'user_token#create'
        get '/profile', to: 'users#profile'
        post '/createUser', to: 'users#create_user'
        get '/mailconfirmation', to: 'users#confirmed_email'
        #post  '/fb_user_token', to: 'facebook_user_token#create'
        post '/findCreateFbUser', to: 'users#find_create_with_fb'
        
        
        # post '/findUser', to:'users#find_user'
      end
    end
    
  end
