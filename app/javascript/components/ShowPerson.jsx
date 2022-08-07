import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import 'antd/dist/antd.css';
import { TrainingsList } from './Training';
import TopMenu from './TopMenu';

class ShowPerson extends React.Component {
  constructor(props) {
    super(props);
    this.state = { person: null };
  }

  componentDidMount() {
    const {
      params: { id },
      navigate,
    } = this.props;

    const url = `/api/v1/people/${id}`;

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((response) => {
        this.setState({ person: response });
      })
      .catch(() => navigate('/'));
  }

  render() {
    const { person } = this.state;
    const {
      params: { id },
    } = this.props;

    if (person !== null) {
      return (
        <div>
          <TopMenu />
          <h1>{person.name}</h1>
          <TrainingsList trainings={person.trainings} />
          <Link to={`/people/${id}/edit`}>
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
ShowPerson.propTypes = {
  params: PropTypes.shape().isRequired,
  navigate: PropTypes.func.isRequired,
};

export default function wrapper() {
  return (
    <ShowPerson
      navigate={useNavigate()}
      params={useParams()}
    />
  );
}
