class Training < ApplicationRecord
  belongs_to :person
  has_many :intervals, dependent: :destroy
  has_many :rawfiles, dependent: :destroy
  accepts_nested_attributes_for :intervals, allow_destroy: true
  before_save :prepare_training
  validates :kind, presence: true
  validates :date, presence: true

  def route
    return nil if route_id.nil?

    Route.find(route_id)
  end

  def all_attributes
    attributes
  end

  private

  def prepare_training
    # Update intervals indices to preserve order
    ix = 1
    intervals.each do |interval|
      interval.ix = ix
      ix += 1
    end
  end
end
