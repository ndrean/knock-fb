class Api::V1::UsersController < ApplicationController
  before_action( :authenticate_user, only: [ :destroy, :profile] )

  def profile
    render json: current_user
  end


  def find_create
    
    user = User.find_by(email: user_params[:email])
    return render json: { status: :not_acceptable }  if user && !user_params[:password]

    user = User.new(user_params) if !user
    
    if user.confirm_token.blank?
      user.confirm_token = user.set_confirmation_token
      logger.debug "..........TOKEN......#{user.confirm_token}"
      UserMailer.register(user.email, user.confirm_token).deliver_now if user.confirm_token
    end

    logger.debug "............Confirmation_token..#{user.confirm_token}"
    
    user.password = user_params[:password]
    user.save
    logger.debug "..................#{user.confirm_email}"
    if user.confirm_email
      #user.password = user_params[:password]
      logger.debug ".............CONFIRMED BY MAIL....#{user.confirm_email}"
      #user.confirm_email = false
      return render json: user, status: 200 if user.save
    end

    render json: { status: 401 }
  end
    
    def confirmed_email
      logger.debug "..............#{params}"
      user = User.find_by(confirm_token: params[:mail_token])
      if user
        logger.debug "..............FOUND...#{user.email}"
        user.confirm_token = nil
        user.confirm_email = true
        user.save
        render json: user, status: 200
      end
      #user.email_activate if user  
    end

  def index
    render json: User.all
  end

  # GET /users/1
  def show
    user = User.find(params[:id])
    render json: user
  end

  # POST /users
  def create
    user = User.new(user_params)
    render json: auth_token
    
    if user.save
      render json: user.to_token_payload  , status: :created
    else
      render json: user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    user = User.find(params[:id])
    if user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    user = User.find(params[:id])
    if user == current_user
      user.destroy
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def auth_params
      params.require(:auth).permit( :access_token, :email, :password_digest, :access_token)
    end

    # Only allow a trusted parameter "white list" through.
    def user_params
      params.require(:user).permit(:email, :name, :password, :password_digest)
    end

    
    
end
  