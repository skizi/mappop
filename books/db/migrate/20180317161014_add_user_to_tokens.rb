class AddUserToTokens < ActiveRecord::Migration[5.1]
  def change
    add_reference :tokens, :user, foreign_key: true
	add_column :tokens, :uuid, :string
	add_column :tokens, :expired_at, :datetime
  end
end
