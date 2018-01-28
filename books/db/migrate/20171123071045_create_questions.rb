class CreateQuestions < ActiveRecord::Migration[5.1]
  def change
    create_table :questions do |t|
      t.string :title
      t.string :content
      t.float :lat
      t.float :lng
      t.integer :user_id

      t.timestamps
    end
  end
end
