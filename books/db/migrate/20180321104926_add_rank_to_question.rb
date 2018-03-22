class AddRankToQuestion < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :rank, :integer, default: -1
  end
end
