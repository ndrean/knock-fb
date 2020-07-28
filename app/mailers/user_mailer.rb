class UserMailer < ApplicationMailer
    def register(user_email, user_confirmation_token)
        @user_email = user_email
        @user_confirmation_token = user_confirmation_token
        mail(to: @user_email,  subject: "confirm registration")

    end
end