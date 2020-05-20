class RootController < ApplicationController
  protect_from_forgery with: :exception
  before_action :authenticate_user!


  # If we get here, the user should be logged in
  def index
    if request.path == "/"
      if current_user.people.size == 0
        redirect_to "/people/new"
      else
        redirect_to "/people/" + current_user.people[0].id.to_s
      end
    end
  end


  def error
  end

end
