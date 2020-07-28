Rails.application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  namespace :api do
    namespace :v1 do
      resources :trainings do
        collection do
          post :search
        end
      end
      resources :rawfiles, only: [:show, :index, :update] do
        collection do
          post :upload
        end
      end
      resources :people do
        collection do
          get :current_person
        end
      end
      resources :routes
    end
  end

  get 'root/index'
  get 'root/error'

  root 'root#index'
  get '/*path' => 'root#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
