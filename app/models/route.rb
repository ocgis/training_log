class Route < ApplicationRecord
  belongs_to :person
  has_many :route_points, dependent: :destroy
  has_many :trainings

  def all_attributes
    route_points_hash = self.route_points.map {
      |route_point| route_point.attributes
    }
    return attributes.update(route_points: route_points_hash)
  end

end
