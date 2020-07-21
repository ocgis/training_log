class Rawfile < ApplicationRecord
  belongs_to :training, optional: true

  NULL_ATTRS = %w( training_id )
  before_save :nil_if_0

  def all_attributes
    if training.nil?
      return attributes
    else
      return attributes.update(training: training.attributes)
    end
  end

  protected

  def nil_if_0
    NULL_ATTRS.each { |attr| self[attr] = nil if self[attr] == 0 }
  end

end
