class Training < ApplicationRecord
  belongs_to :person
  has_many :intervals, dependent: :destroy
  accepts_nested_attributes_for :intervals, allow_destroy: true
  before_save :prepare_training

  def date_yyyy_mm_dd
    return date.strftime("%Y-%m-%d")
  end


  def duration_hh_mm_ss
    if duration_s.nil?
      return nil
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


  def route
    if not route_id.nil?
      return Route.find(route_id)
    else
      return nil
    end
  end

  private

  def prepare_training
    # Update intervals indices to preserve order
    ix = 1
    self.intervals.each do |interval|
      interval.ix = ix
      ix = ix + 1
    end
  end

end
