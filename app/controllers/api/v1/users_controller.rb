class Api::V1::UsersController < ApplicationController
  #before_action( :authenticate_user, only: [ :destroy] )

  # endpoint check user
  def profile
    render json: current_user
  end

  def find_create_with_fb   
    fb_user = User.find_or_create_by(uid: user_params['uid']) do |user|
      user.email = user_params['email']
      pwd = SecureRandom.urlsafe_base64.to_s
      user.password = pwd
      user.name = pwd
      #user.access_token = pwd
      user.uid = user_params['uid']
      user.save
    end
    if fb_user.confirm_token.blank? && !fb_user.confirm_email
      fb_user.confirm_token = SecureRandom.urlsafe_base64.to_s
      UserMailer.register(fb_user.email, fb_user.confirm_token).deliver_now #if fb_user.confirm_token
      fb_user.save
    end
    if fb_user.confirm_email
      logger.debug ".............CONFIRMED BY MAIL....#{fb_user.confirm_email}"
      return render json: fb_user, status: 200 if fb_user.save
    end
    render json: { status: 401 }
  end

  def create_user
    return render json: { status: :not_acceptable }  if !user_params[:password]
    user = User.find_by(email: user_params[:email])
    user.password = user_params[:password] if user
    user = User.create(user_params) if !user
    if user.confirm_token.blank? #&& !user.confirm_email
      user.confirm_token = SecureRandom.urlsafe_base64.to_s
      user.save
      UserMailer.register(user.email, user.confirm_token).deliver_now
    end
    
    if user.confirm_email && user.confirm_token.blank?
      return render json: user, status: 200
    end

    render json: { status: 401 }
  end
    
  # endpoint of link via mail
  def confirmed_email
    user = User.find_by(confirm_token: params[:mail_token])
    if user
      user.confirm_token = nil
      user.confirm_email = true
      user.save
      return render json: user, status: 200
    end
    render json: { status: 401 }
  end

  def index
    render json: User.all
  end

  # GET /users/1
  def show
    user = User.find(params[:id])
    render json: user
  end


  # DELETE /users/1
  def destroy
    user = User.find(params[:id])
    if user == current_user
      user.destroy
    end
  end

  private
    def auth_params
      params.require(:auth).permit( :email, :password_digest, :access_token, :uid)
    end

    def user_params
      params.require(:user).permit(:email, :name, :password, :password_digest, :access_token, :uid)
    end

    
    
end
  