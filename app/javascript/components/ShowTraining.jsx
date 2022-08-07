import React from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import Route from './Route';
import { Rawfile } from './Rawfile';
import {
  distanceDurationToSpeed, toHHMMSS, toKm, toYYYYMMDD,
} from './Conversions';
import TopMenu from './TopMenu';

class ShowTraining extends React.Component {
  constructor(props) {
    super(props);
    this.state = { training: null };
  }

  componentDidMount() {
    const {
      params: { id },
    } = this.props;

    const url = `/api/v1/trainings/${id}`;

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((response) => {
        this.setState({ training: response });
      })
      .catch((error) => console.log(error));
  }

  render() {
    const renderField = (prefix, value, suffix) => {
      if (value != null) {
        let result = '';
        if (prefix !== null) {
          result += `${prefix} `;
        }
        result += value;
        if (suffix !== null) {
          result += ` ${suffix}`;
        }
        return (
          <div>
            <br />
            {result}
          </div>
        );
      }
      return null;
    };

    const renderRoute = (training) => {
      if (training.route_id != null) {
        return (
          <div>
            <br />
            <Link to={`/routes/${training.route_id}`}>
              { training.route_id }
            </Link>
          </div>
        );
      }
      return null;
    };

    const renderDescription = (training) => {
      if (training.description != null) {
        return (
          <div>
            <br />
            { training.description }
          </div>
        );
      }
      return null;
    };

    const renderIntervals = (intervals) => {
      const renderInterval = (interval, index) => (
        <tr key={index}>
          <th>{toHHMMSS(interval.duration_s)}</th>
          <th>{toKm(interval.distance_m)}</th>
          <th>{distanceDurationToSpeed(interval.distance_m, interval.duration_s)}</th>
          <th>{interval.comment}</th>
        </tr>
      );

      if (intervals.length > 0) {
        return (
          <div>
            <h3>Intervaller</h3>
            <table>
              <thead>
                <tr>
                  <th>Tid</th>
                  <th>Sträcka</th>
                  <th>Hastighet</th>
                  <th>Kommentar</th>
                </tr>
              </thead>
              <tbody>
                {
                  intervals.map((interval, index) => renderInterval(interval, index))
                }
              </tbody>
            </table>
          </div>
        );
      }
      return null;
    };

    const { training } = this.state;
    const {
      params: { id },
    } = this.props;

    if (training !== null) {
      return (
        <div>
          <TopMenu />
          {toYYYYMMDD(training.date)}
          {' '}
          {training.kind}
          {' '}
          {toHHMMSS(training.duration_s)}
          {' '}
          {toKm(training.distance_m)}
          {' '}
          {distanceDurationToSpeed(training.distance_m, training.duration_s)}
          {renderDescription(training)}
          {renderRoute(training)}
          {renderField('Maxpuls:', training.max_pulse_bpm, 'slag/min')}
          {renderField('Medelpuls:', training.avg_pulse_bpm, 'slag/min')}
          {renderField('Energiförbrukning:', training.energy_kcal, 'kcal')}
          {renderField('Intensitet:', training.intensity, '')}
          {renderIntervals(training.intervals_attributes)}
          <Route route={training.route} />
          {
            training.rawfiles.map((rawfile) => (
              <Rawfile key={rawfile.orig_filename} rawfile={rawfile} />
            ))
          }
          <Link to={`/trainings/${id}/edit`}>
            Edit
          </Link>
        </div>
      );
    }
    return (
      <div>
        <TopMenu />
        <h1>Loading</h1>
      </div>
    );
  }
}
ShowTraining.propTypes = {
  params: PropTypes.shape().isRequired,
};

export default function wrapper() {
  return (
    <ShowTraining
      params={useParams()}
    />
  );
}
