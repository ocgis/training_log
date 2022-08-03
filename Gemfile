# frozen_string_literal: true

source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails'

# Use Puma as the app server
gem 'puma'

gem 'turbo-rails'

# Use Capistrano for deployment
gem 'capistrano-rails', group: :development

# Add this if you're using rbenv
gem 'capistrano-rbenv', github: 'capistrano/rbenv'

group :development, :test do
  # Use sqlite3 as the database for Active Record
  gem 'sqlite3'
end

group :development do
  gem 'listen', '~> 3.0.5'
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end

group :staging, :production do
  # Use mysql as the database for Active Record
  gem 'mysql2'
end

# Export db data
gem 'yaml_db'

# Authentication
gem 'devise'
gem 'omniauth-facebook'
gem 'omniauth-rails_csrf_protection'

# Used for permissions
gem 'cancancan'
gem 'role_model'

# React
gem 'react-rails'
gem 'webpacker'

# FIT
gem 'rubyfit'

gem 'strscan', '= 3.0.1'
