json.extract! question, :title, :content, :lat, :lng, :user_id, :photo

json.url question_url(question, format: :json)
