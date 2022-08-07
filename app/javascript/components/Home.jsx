import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

class Home extends React.Component {
  componentDidMount() {
    const { navigate } = this.props;
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    axios
      .get('/api/v1/people/current_person')
      .then((response) => {
        const current_person = response.data;
        if (current_person == null) {
          navigate('/people/new');
        } else {
          navigate(`/people/${current_person}`);
        }
      });
  }

  render() {
    return (<div />);
  }
}
Home.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default function wrapper() {
  return (
    <Home
      navigate={useNavigate()}
    />
  );
}
