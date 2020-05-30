import React from "react";
import { Link } from "react-router-dom";
import { Map, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'

//const position = [51.505, -0.09]

class Route extends React.Component {
    constructor(props) {
        super(props);
        this.state = { route: null };
    }

    componentDidMount() {
        const {
            match: {
                params: { id }
            }
        } = this.props;

        const url = `/api/v1/routes/${id}`;

        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => {
                this.setState({ route: response });
            })
            .catch(() => this.props.history.push("/"));
    }

    render() {
        const { route } = this.state;
        const {
            match: {
                params: { id }
            }
        } = this.props;

        if (route !== null) {
            var startPosition = [route.route_points[0].latitude,
                                 route.route_points[0].longitude];
            var polyline = route.route_points.map(p => [p.latitude, p.longitude]);
            return (
                <div>
                  <div>
                    {route.name}
                    {" "}
                    {route.distance_km}
                    <Link to={"/routes/"+id+"/edit"}>
                      Edit
                    </Link>
                  </div>
                  <Map center={startPosition} zoom={13}>
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
        } else {
            return (<h1>Loading</h1>);
        }
    }
}


export default Route;
