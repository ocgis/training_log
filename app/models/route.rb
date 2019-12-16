class Route < ApplicationRecord
  belongs_to :person
  has_many :route_points, dependent: :destroy
  has_many :trainings
end
