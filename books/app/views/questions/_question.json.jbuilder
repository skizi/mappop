json.extract! question, :title, :content, :lat, :lng, :user_id, :photo, :country, :state, :city

json.url question_url(question, format: :json)
