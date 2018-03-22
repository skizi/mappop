class AddCountryRankToQuestions < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :country_rank, :integer, default: -1
    add_column :questions, :state_rank, :integer, default: -1
  end
end
