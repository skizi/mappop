class CommentsController < ApplicationController
  def index
  end

  def show
  end

  def all
  	create_table :comments do |t|
      t.references :user, index: true
      t.references :question, index: true
      t.string :content

      t.timestamps null: false
      t.index [:user_id,:question_id ,:created_at ]
    end
  end
end
