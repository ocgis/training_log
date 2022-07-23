import React from 'react';
import PropTypes from 'prop-types';
import Route from './Route';
import { TrainingsList } from './Training';
import TopMenu from './TopMenu';

class ShowRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = { route: null };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      history,
    } = this.props;

    const url = `/api/v1/routes/${id}`;

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((response) => {
        this.setState({ route: response });
      })
      .catch(() => history.push('/'));
  }

  render() {
    const { route } = this.state;

    if (route !== null) {
      /* const startPosition = [
       *   route.route_points[0].latitude,
       *   route.route_points[0].longitude
       * ];
       * const polyline = route.route_points.map((p)=> [p.latitude, p.longitude]); */
      return (
        <div>
          <TopMenu />
          <Route route={route} />
          <TrainingsList trainings={route.trainings} />
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
ShowRoute.propTypes = {
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default ShowRoute;
