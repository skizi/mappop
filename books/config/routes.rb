Rails.application.routes.draw do

  root to: 'home#index'

  get 'login' => 'sessions#new'
  # 'sessions#new'
  post 'login' => 'sessions#create'
  delete 'logout' => 'sessions#destroy'
  get 'logout' => 'sessions#destroy'


  get 'questions' => 'questions#index'
  get 'questions/all'
  get 'questions/new/:user_id' => 'questions#new'
  get 'questions/:id' => 'questions#show'


  get 'comments/all'
  get 'comments/get_comments/:question_id' => 'comments#get_comments'
  get 'comments/new/:user_id' => 'comments#new'

  get 'likes/all'
  get 'likes/get_likes/:question_id' => 'likes#get_likes'
  get 'likes/new/:user_id' => 'likes#new'

  #記述が上の方のものほど重要度が増す

  get 'signup' => 'users#new'
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
