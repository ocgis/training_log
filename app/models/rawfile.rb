class Rawfile < ApplicationRecord
  belongs_to :training, optional: true

  def all_attributes
    if training.nil?
      return attributes
    else
      return attributes.update(training: training.attributes)
    end
  end

end
