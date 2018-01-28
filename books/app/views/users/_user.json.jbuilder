json.extract! user, :name, :username, :location, :about, :email, :password

json.url user_url(user, format: :json)
