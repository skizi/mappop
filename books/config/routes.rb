Rails.application.routes.draw do

  root to: 'home#index'

  get 'privacypolicy' => 'home#privacypolicy'

  get 'login' => 'sessions#new'
  # 'sessions#new'
  post 'login' => 'sessions#create'
  delete 'logout' => 'sessions#destroy'
  get 'logout' => 'sessions#destroy'
  get '/auth/:provider/callback' => 'sessions#createTwitter'


  get 'questions' => 'questions#index'
  get 'questions/all'
  get 'questions/get_yahoo'
  get 'questions/get_k_cloud'
  get 'questions/get_fb_items'
  get 'questions/search_lat_lng'
  get 'questions/get_ranking/:key' => 'questions#get_ranking'
  get 'questions/refresh_ranking'
  get 'questions/new/:user_id' => 'questions#new'
  get 'questions/:id' => 'questions#show'


  get 'comments/all'
  get 'comments/get_comments/:question_id' => 'comments#get_comments'
  get 'comments/new/:user_id' => 'comments#new'

  get 'likes/all'
  get 'likes/get_likes/:question_id' => 'likes#get_likes'
  post 'likes/create/:question_id' => 'likes#create'
  get 'likes/edit'

  #記述が上の方のものほど重要度が増す

  get 'signup' => 'users#new'
  get 'signup/:provider' => 'users#new'
  get 'users/new/:provider' => 'users#new'
  get 'users/new' => 'users#new'
  get 'users/token/:uuid' => 'users#token'
  get 'users/tmp'
  get 'users/all'
  get 'users/:id' => 'users#show'
  post 'users/upload_process'



  resources :questions
  resources :tweets
  resources :users
  resources :comments
  resources :likes


  get 'questions/index'
  get 'questions/new'
  get 'questions/save'


  get 'comments/index'
  get 'comments/show'

  get 'likes/index'
  get 'likes/show'

  get 'users/index'
  

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
