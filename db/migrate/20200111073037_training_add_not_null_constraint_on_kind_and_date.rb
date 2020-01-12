class TrainingAddNotNullConstraintOnKindAndDate < ActiveRecord::Migration[5.0]
  def change
    Training.all.each do |training|
      if training.kind.nil?
        training.kind = "Unknown"
        training.save
      end

      if training.date.nil?
        training.date = DateTime.now()
        training.save
      end
    end

    change_column_null :trainings, :kind, false
    change_column_null :trainings, :date, false
  end
end
