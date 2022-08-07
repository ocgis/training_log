import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    const {
      params: { id },
      navigate,
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
      .catch(() => navigate('/'));
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
  params: PropTypes.shape().isRequired,
  navigate: PropTypes.func.isRequired,
};

export default function wrapper() {
  return (
    <EditTraining
      navigate={useNavigate()}
      params={useParams()}
    />
  );
}
