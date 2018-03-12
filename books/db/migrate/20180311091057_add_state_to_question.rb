class AddStateToQuestion < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :state, :string
  end
end
