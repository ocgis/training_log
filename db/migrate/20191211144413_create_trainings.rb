class CreateTrainings < ActiveRecord::Migration[5.0]
  def change
    create_table :trainings do |t|
      t.string :kind
      t.datetime :date
      t.text :description
      t.integer :duration_s
      t.integer :distance_m
      t.integer :max_pulse_bpm
      t.integer :avg_pulse_bpm
      t.integer :energy_kcal
      t.integer :intensity
      t.integer :altid
      t.integer :route_id
      t.references :person, foreign_key: true

      t.timestamps
    end
    add_index :trainings, :route_id
  end
end
