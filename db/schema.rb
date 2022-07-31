# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_07_31_054530) do
  create_table "intervals", force: :cascade do |t|
    t.integer "duration_s"
    t.integer "distance_m"
    t.text "comment"
    t.integer "ix"
    t.integer "training_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["training_id"], name: "index_intervals_on_training_id"
  end

  create_table "people", force: :cascade do |t|
    t.string "name"
    t.integer "altid"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "user_id"
    t.index ["user_id"], name: "index_people_on_user_id"
  end

  create_table "rawfiles", force: :cascade do |t|
    t.string "filename"
    t.string "orig_filename"
    t.string "content_type"
    t.integer "size"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "training_id"
    t.index ["training_id"], name: "index_rawfiles_on_training_id"
  end

  create_table "route_points", force: :cascade do |t|
    t.float "latitude"
    t.float "longitude"
    t.integer "ix"
    t.integer "route_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["route_id"], name: "index_route_points_on_route_id"
  end

  create_table "routes", force: :cascade do |t|
    t.float "distance_km"
    t.string "name"
    t.integer "altid"
    t.integer "person_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["person_id"], name: "index_routes_on_person_id"
  end

  create_table "trainings", force: :cascade do |t|
    t.string "kind", null: false
    t.datetime "date", precision: nil, null: false
    t.text "description"
    t.integer "duration_s"
    t.integer "distance_m"
    t.integer "max_pulse_bpm"
    t.integer "avg_pulse_bpm"
    t.integer "energy_kcal"
    t.integer "intensity"
    t.integer "altid"
    t.integer "person_id"
    t.integer "route_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["person_id"], name: "index_trainings_on_person_id"
    t.index ["route_id"], name: "index_trainings_on_route_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "provider"
    t.string "uid"
    t.integer "roles_mask"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["provider"], name: "index_users_on_provider"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid"], name: "index_users_on_uid"
  end

end
