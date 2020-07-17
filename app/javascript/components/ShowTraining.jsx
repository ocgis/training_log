import React from "react";
import { Link } from "react-router-dom";
import { Route } from "./Route";
import { Rawfile } from "./Rawfile";

class Training extends React.Component {
    constructor(props) {
        super(props);
        this.state = { training: null };
    }

    componentDidMount() {
        const {
            match: {
                params: { id }
            }
        } = this.props;

        const url = `/api/v1/trainings/${id}`;

        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => {
                this.setState({ training: response });
            })
            .catch(() => this.props.history.push("/"));
    }

    render() {
        const { training } = this.state;
        const {
            match: {
                params: { id }
            }
        } = this.props;

        if (training !== null) {
            return (
                <div>
                  {training.date_yyyy_mm_dd}
                  {" "}
                  {training.kind}
                  {" "}
                  {training.duration_hh_mm_ss}
                  {" "}
                  {training.distance_km}
                  {this.renderDescription(training)}
                  {this.renderRoute(training)}
                  {this.renderField("Maxpuls:", training.max_pulse_bpm, "slag/min")}
                  {this.renderField("Medelpuls:", training.avg_pulse_bpm, "slag/min")}
                  {this.renderField("Energiförbrukning:", training.energy_kcal, "kcal")}
                  {this.renderField("Intensitet:", training.intensity, "")}
                  {this.renderIntervals(training.intervals_attributes)}
                  <Route route={training.route} />
                  {
                      training.rawfiles.map((rawfile, index) =>
                                            {
                                                return (<Rawfile key={index} rawfile={rawfile} />);
                                            }
                                           )
                  }
                  <Link to={"/trainings/"+id+"/edit"}>
                    Edit
                  </Link>
                </div>
            );
        } else {
            return (<h1>Loading</h1>);
        }
    }

    renderDescription(training) {
        if (training.description != null) {
            return (
                <div>
                  <br />
                  { training.description }
                </div>
            );
        } else {
            return null;
        }
    }

    renderRoute(training) {
        if (training.route_id != null) {
            return (
                <div>
                  <br />
                  <Link to={"/routes/"+training.route_id}>
                    { training.route_id }
                  </Link>
                </div>
            );
        } else {
            return null;
        }
    }

    renderField(prefix, value, suffix) {
        if (value != null) {
            if (prefix == null) {
                prefix = '';
            } else {
                prefix = prefix + ' ';
            }
            if (suffix == null) {
                suffix = '';
            } else {
                suffix = ' ' + suffix;
            }
            var result = prefix + value + suffix;
            return (<div>
                    <br />
                    {result}
                    </div>);
        } else {
            return null;
        }
    }


    renderIntervals(intervals) {
        if (intervals.length > 0) {
            return (<div>
                    <h3>Intervaller</h3>
                    <table>
                    <thead>
                    <tr>
                    <th>Tid</th>
                    <th>Sträcka</th>
                    <th>Tempo</th>
                    <th>Hastighet</th>
                    <th>Kommentar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        intervals.map((interval, index) =>
                                      {
                                          return this.renderInterval(interval, index);
                                      }
                                     )
                    }
                    </tbody>
                    </table>
                    </div>
                   );
        } else {
            return null;
        }
    }


    renderInterval(interval, index) {
        return (<tr key={index}>
                <th>{interval.duration_hh_mm_ss}</th>
                <th>{interval.distance_km}</th>
                <th>{interval.pace_min_km}</th>
                <th>{interval.speed_km_h}</th>
                <th>{interval.comment}</th>
                </tr>);
    }
}


export default Training;
