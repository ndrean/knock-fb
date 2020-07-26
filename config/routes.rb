  Rails.application.routes.draw do
    namespace :api do
      namespace :v1 do
        resources :users, only: [:index, :show, :create, :destroy, :update]
        post '/userToken', to: 'user_token#create'
        get '/profile', to: 'users#profile'
        post '/findCurrent', to: 'users#find'
      end
    end
    
  end
