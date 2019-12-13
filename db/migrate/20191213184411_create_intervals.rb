class CreateIntervals < ActiveRecord::Migration[5.0]
  def change
    create_table :intervals do |t|
      t.integer :duration_s
      t.integer :distance_m
      t.text :comment
      t.integer :ix
      t.references :training, foreign_key: true

      t.timestamps
    end
  end
end
