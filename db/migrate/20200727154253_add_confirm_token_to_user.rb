class AddConfirmTokenToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :confirm_token, :boolean
  end
end
