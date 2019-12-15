class Person < ApplicationRecord
  has_many :trainings, dependent: :destroy
  has_many :routes, dependent: :destroy
end
