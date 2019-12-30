Rails.application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  resources :route_points
  resources :routes
  resources :intervals
  resources :trainings
  resources :people
  get 'people/index'

  get 'people/show'

  get 'root/index'
  get 'root/error'

  root 'root#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
