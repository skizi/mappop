json.extract! comment, :content, :user_id, :question_id

json.url comment_url(comment, format: :json)
