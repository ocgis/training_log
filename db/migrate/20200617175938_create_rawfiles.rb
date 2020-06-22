class CreateRawfiles < ActiveRecord::Migration[5.0]
  def change
    create_table :rawfiles do |t|
      t.string :filename
      t.string :orig_filename
      t.string :content_type
      t.integer :size

      t.timestamps
    end
  end
end
