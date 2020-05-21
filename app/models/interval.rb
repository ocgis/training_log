class Interval < ApplicationRecord
  belongs_to :training, optional: true


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


  def duration_hh_mm_ss=(dhms)
    parts = dhms.split(':')
    if parts.size == 0
      self.duration_s = nil
    elsif parts.size == 1
      self.duration_s = parts[0].to_i * 60
    elsif parts.size == 2
      self.duration_s = parts[0].to_i * 60 + parts[1].to_i
    elsif parts.size == 3
      self.duration_s = parts[0].to_i * 3600 + parts[1].to_i * 60 + parts[2].to_i
    else
      raise "Can't handle time %s!" % dhms
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

  def all_attributes
    return attributes.update(duration_hh_mm_ss: duration_hh_mm_ss,
                             distance_km: distance_km)
  end

end
