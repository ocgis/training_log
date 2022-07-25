import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Map, Marker, Polyline, Popup, TileLayer,
} from 'react-leaflet';

function Route(props) {
  const { route } = props;

  if (route == null) {
    return null;
  }

  const startPosition = [
    route.route_points[0].latitude,
    route.route_points[0].longitude,
  ];
  const polyline = route.route_points.map((p) => [p.latitude, p.longitude]);
  return (
    <div>
      <div>
        {route.name}
        {' '}
        {route.distance_km}
        <Link to={`/routes/${route.id}/edit`}>
          Edit
        </Link>
      </div>
      <Map
        center={startPosition}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Marker position={startPosition}>
          <Popup>Start</Popup>
        </Marker>
        <Polyline positions={polyline} />
      </Map>
    </div>
  );
}
Route.propTypes = {
  route: PropTypes.shape(),
};
Route.defaultProps = {
  route: null,
};

export default Route;
