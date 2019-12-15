json.extract! route, :id, :distance_km, :name, :altid, :person_id, :created_at, :updated_at
json.url route_url(route, format: :json)
