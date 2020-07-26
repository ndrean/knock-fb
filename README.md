# Knock

```bash

rails g knock:install
rails g knock:token_controller user

```

For namespaced routes:

```ruby
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users
      post '/get_token', to: 'user_token#create'
    end
  end

end
```

```ruby
class ApplicationController < ActionController::API
    include Knock::Authenticable

    private

    def authenticate_v1_user
      authenticate_for V1::User
    end
end
```

```ruby
#/app/controllers/api/v1
class Api::V1::UserTokenController < Knock::AuthTokenController
end
```

The Knock gem expects the request (POST to http://localhost:3000/api/v1/get_token) in the following format:

```json
{
  auth:{
    email:"toto@test.fr,
    password:"password"
  }
}
```
