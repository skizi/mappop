class RenameRankColumnToQuestions < ActiveRecord::Migration[5.1]
  def change
    rename_column :questions, :rank, :cityRank
  end
end
