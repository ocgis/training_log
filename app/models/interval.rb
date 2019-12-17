class Interval < ApplicationRecord
  belongs_to :training


  def duration_hh_mm_ss
    if duration_s.nil?
      return ''
    else
      h = duration_s / 60 / 60
      m = (duration_s / 60) % 60
      s = duration_s % 60
      return '%d:%02d:%02d' % [h, m, s]
    end
  end


  def distance_km
    if distance_m.nil?
      return ''
    else
      return '%d,%03d km' % [distance_m / 1000, distance_m % 1000]
    end
  end


  def pace_min_km
    if distance_m.nil? or duration_s.nil?
      return ''
    else
      pace_s_km = (duration_s * 1000) / distance_m
      m_km = pace_s_km / 60
      s_km = pace_s_km % 60
      return '%d:%02d min/km' % [m_km, s_km]
    end
  end


  def speed_km_h
    if distance_m.nil? or duration_s.nil?
      return ''
    else
      speed_m_h = (distance_m * 3600) / duration_s
      return '%d,%03d km/h' % [speed_m_h / 1000, speed_m_h % 1000]
    end
  end


end
