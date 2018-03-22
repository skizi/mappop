class RenameCityRankColumnToQuestions < ActiveRecord::Migration[5.1]
  def change
    rename_column :questions, :cityRank, :city_rank
  end
end
