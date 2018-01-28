json.extract! question, :title, :content, :lat, :lng, :user_id

json.url question_url(question, format: :json)
