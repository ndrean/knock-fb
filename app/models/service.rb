class Service < ApplicationRecord
    belongs_to :user

    def facebook_client
        Koala::Facebook::API.new(access_token)
    end
end