# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20191215174345) do

  create_table "intervals", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer  "duration_s"
    t.integer  "distance_m"
    t.text     "comment",     limit: 65535
    t.integer  "ix"
    t.integer  "training_id"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["training_id"], name: "index_intervals_on_training_id", using: :btree
  end

  create_table "people", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "name"
    t.integer  "altid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "route_points", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.float    "latitude",   limit: 24
    t.float    "longitude",  limit: 24
    t.integer  "ix"
    t.integer  "route_id"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.index ["route_id"], name: "index_route_points_on_route_id", using: :btree
  end

  create_table "routes", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.float    "distance_km", limit: 24
    t.string   "name"
    t.integer  "altid"
    t.integer  "person_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.index ["person_id"], name: "index_routes_on_person_id", using: :btree
  end

  create_table "trainings", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "kind"
    t.datetime "date"
    t.text     "description",   limit: 65535
    t.integer  "duration_s"
    t.integer  "distance_m"
    t.integer  "max_pulse_bpm"
    t.integer  "avg_pulse_bpm"
    t.integer  "energy_kcal"
    t.integer  "intensity"
    t.integer  "altid"
    t.integer  "route_id"
    t.integer  "person_id"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.index ["person_id"], name: "index_trainings_on_person_id", using: :btree
    t.index ["route_id"], name: "index_trainings_on_route_id", using: :btree
  end

  add_foreign_key "intervals", "trainings"
  add_foreign_key "route_points", "routes"
  add_foreign_key "routes", "people"
  add_foreign_key "trainings", "people"
end
