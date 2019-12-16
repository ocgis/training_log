class Training < ApplicationRecord
  belongs_to :person
  has_many :intervals, dependent: :destroy

  def date_yyyy_mm_dd
    return date.strftime("%Y-%m-%d")
  end


  def duration_hh_mm_ss
    h = duration_s / 60 / 60
    m = (duration_s / 60) % 60
    s = duration_s % 60
    return '%d:%02d:%02d' % [h, m, s]
  end


  def distance_km
    if distance_m.nil?
      return ''
    else
      return '%d,%03d km' % [distance_m / 1000, distance_m % 1000]
    end
  end


  def route
    if not route_id.nil?
      return Route.find(route_id)
    else
      return nil
    end
  end

end
