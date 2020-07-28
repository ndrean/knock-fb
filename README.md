# Rails Credentials

eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1OTYwMzYxOTEsInN1YiI6MzZ9.uIU4DY5tdAnewiIoHoNBXWliVk-xbM3Wf_J28QmN9tM

Read: <https://blog.saeloun.com/2019/10/10/rails-6-adds-support-for-multi-environment-credentials.html>

```bash
EDITOR="VIM" bin/rails credentials:edit --environment production
```

=> creates the files `config/credentials/production.key` (can be shared with team) and `config/credentials/production.yml.enc`.

# Knock

<https://medium.com/the-boujoukos-bulletin/basic-authentication-with-react-rails-knock-c10ff03e1399>

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
  "auth": {
    "email": "toto@test.fr",
    "password": "password"
  }
}
```

> Note: `current_user` is available for all the controllers.

Once you have a token, you can get the user data with:

```ruby
#api/v1/UsersControllers
class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user, only [:profile, :show, :delete]
  def profile
    render json: current_user
  end
  [...]
end
```

Generate token from controller: you pass the `user.id` as a subject.

```ruby
if user
  knock_token = Knock::AuthToken.new(payload: {sub: user.id}).token
  logger.debug "..................TOKEN...#{knock_token}"
end
```

Decode the token with `JWT`:

```
JWT.decode(token, Rails.application.secret_key_base, 'HS256')
```

Encode a token with `JWT`:

```
JWT.encode(payload: {sub: user.id}, Rails.application.secret_key_base, 'HS256')
```
