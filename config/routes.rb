  Rails.application.routes.draw do
    namespace :api do
      namespace :v1 do
        resources :users, only: [:index, :show, :create, :destroy, :update]
        post '/getUserToken', to: 'user_token#create'
        get '/profile', to: 'users#profile'
        post '/findCreateUser', to: 'users#find_create'
        get '/mailconfirmation', to: 'users#confirmed_email'
        # post '/findUser', to:'users#find_user'
      end
    end
    
  end
