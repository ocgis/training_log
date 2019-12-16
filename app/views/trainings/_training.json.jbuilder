json.extract! training, :id, :kind, :date, :description, :duration_s, :distance_m, :max_pulse_bpm, :avg_pulse_bpm, :energy_kcal, :intensity, :altid, :route_id, :person_id, :created_at, :updated_at
json.url training_url(training, format: :json)
