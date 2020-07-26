class Api::V1::UsersController < ApplicationController

  before_action( :authenticate_user, only: [ :index, :show, :destroy] )
  #before_action :authenticate_v1_user, only:[:destroy]

  def profile
    render json: current_user
  end

  def find
    user = User.find_by(email: params[:user][:email])
    if user
        render json: user, status: 200
    else
      render json: user.errors, status: 404
    end
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
    

    # Only allow a trusted parameter "white list" through.
    def user_params
      params.require(:user).permit(:email, :name, :password, :password_digest)
    end

end
  