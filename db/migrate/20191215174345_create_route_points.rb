class CreateRoutePoints < ActiveRecord::Migration[5.0]
  def change
    create_table :route_points do |t|
      t.float :latitude
      t.float :longitude
      t.integer :ix
      t.references :route, foreign_key: true

      t.timestamps
    end
  end
end
