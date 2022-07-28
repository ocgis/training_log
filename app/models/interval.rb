class Interval < ApplicationRecord
  belongs_to :training, optional: true

  def all_attributes
    attributes
  end
end
