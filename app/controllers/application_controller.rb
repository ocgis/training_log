class ApplicationController < ActionController::Base
  check_authorization

  protect_from_forgery with: :exception
  before_action :authenticate_user!

  def after_sign_in_path_for(resource)
    request.env['omniauth.origin'] || root_path
  end

end
