class ApplicationController < ActionController::API
# class ApiController < ActionController::API
    include Knock::Authenticable  

    private
    
    # def authenticate_user
    #   authenticate_for User
    # end
end
