class User < ApplicationRecord
    has_secure_password

    validates :email, uniqueness: true, presence: true
    validates :password_digest, presence: true

    def set_confirmation_token
        self.confirm_token = SecureRandom.urlsafe_base64.to_s #if self.confirm_token.blank?
    end

    # def email_activate
    #     self.confirm_email = true
    #     self.confirm_token = nil
    #     save!(validate: false)
    # end

    def email_recover
    end

    def auth_params
      params.require(:auth).permit( :access_token, :email, :password_digest, :access_token)
    end
    
end
