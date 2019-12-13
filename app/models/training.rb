class Training < ApplicationRecord
  belongs_to :person
  has_many :intervals, dependent: :destroy
end
