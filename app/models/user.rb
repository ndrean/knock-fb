class User < ApplicationRecord
    has_secure_password

    validates :email, uniqueness: true, presence: true
    validates :password_digest, presence: true

    # def to_token_payload
    #     {
    #         sub: id,
    #         email: email
    #     }
    # end

    
end
