class AddPhotoUrlToTweets < ActiveRecord::Migration[5.1]
  def change
    add_column :tweets, :photo_url, :string
  end
end
