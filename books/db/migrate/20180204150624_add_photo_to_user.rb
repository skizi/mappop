class AddPhotoToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :photo, :mediumblob
  end
end
