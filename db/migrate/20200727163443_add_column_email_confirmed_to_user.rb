class AddColumnEmailConfirmedToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :confirm_email, :boolean
  end
end
