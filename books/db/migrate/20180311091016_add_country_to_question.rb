class AddCountryToQuestion < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :country, :string
  end
end
