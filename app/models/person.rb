class Person < ApplicationRecord
  belongs_to :user
  has_many :trainings, dependent: :destroy
  has_many :routes, dependent: :destroy
end
