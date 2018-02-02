Rails.application.routes.draw do

  root to: 'home#index'

  get 'login' => 'sessions#new'
  post 'login' => 'sessions#create'
  delete 'logout' => 'sessions#destroy'

  get 'comments/index'
  get 'comments/show'


  get 'questions/all'
  get 'questions/new/:user_id' => 'questions#new'


  #記述が上の方のものほど重要度が増す

  get 'signup' => 'users#new'
  get 'users/all'
  get 'users/:id' => 'users#show'

  get 'tweets/upload/:id' => 'tweets#upload'


  resources :questions
  resources :tweets
  resources :users


  get 'questions/index'
  get 'questions/show'
  get 'questions/new'
  get 'questions/save'


  get 'tweets/index'
  #get 'tweets/show/:id' => 'tweets#show'
  #get 'tweets/update'
  #get 'tweets/new'
  post 'tweets/upload_process'
  #get 'tweets/detail/:id' => 'tweets#detail'
  #post "tweets" => "tweets#create"

  get 'users/index'
  #get 'tweets/show/:id' => 'tweets#show'
  #get 'tweets/update/:id' => 'tweets#update'
  

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
