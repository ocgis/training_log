class Person < ApplicationRecord
  has_many :trainings, dependent: :destroy
end
