class AddCityToQuestion < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :city, :string
  end
end
