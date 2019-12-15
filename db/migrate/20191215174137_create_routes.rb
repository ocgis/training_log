class CreateRoutes < ActiveRecord::Migration[5.0]
  def change
    create_table :routes do |t|
      t.float :distance_km
      t.string :name
      t.integer :altid
      t.references :person, foreign_key: true

      t.timestamps
    end
  end
end
