class ChangeConfirmTokenToString < ActiveRecord::Migration[6.0]
  def change
    change_column :users, :confirm_token, :string
  end
end
