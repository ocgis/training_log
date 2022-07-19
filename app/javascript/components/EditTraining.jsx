import React from 'react';
import PropTypes from 'prop-types';
import TrainingForm from './TrainingForm';
import TopMenu from './TopMenu';

const afterSubmit = (response) => {
  const training = response.data;
  window.location.href = `/trainings/${training.id}`;
};

class EditTraining extends React.Component {
  constructor(props) {
    super(props);
    this.state = { training: null };
  }

  componentDidMount() {
    const { history } = this.props;
    const {
      match: {
        params: { id },
      },
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
      .catch(() => history.push('/'));
  }

  render() {
    const { training } = this.state;

    if (training !== null) {
      return (
        <div>
          <TopMenu />
          <TrainingForm training={training} afterSubmit={afterSubmit} />
        </div>
      );
    }
    return (
      <div>
        <TopMenu />
        <h1>Loading...</h1>
      </div>
    );
  }
}
EditTraining.propTypes = {
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default EditTraining;
