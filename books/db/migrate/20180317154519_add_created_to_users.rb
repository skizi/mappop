class AddCreatedToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :created, :boolean, default: false, null: false
  end
end
