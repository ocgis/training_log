class RootController < ApplicationController
  protect_from_forgery with: :exception
  before_action :authenticate_user!


  # If we get here, the user should be logged in
  def index
    if current_user.people.size == 0
      redirect_to controller: :people, action: :new
    else
      redirect_to current_user.people[0]
    end
  end


  def error
  end

end
