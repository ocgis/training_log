import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class Home extends React.Component {
  componentDidMount() {
    const { history } = this.props;
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    axios
      .get('/api/v1/people/current_person')
      .then((response) => {
        const current_person = response.data;
        if (current_person == null) {
          history.push('/people/new');
        } else {
          history.push(`/people/${current_person}`);
        }
      });
  }

  render() {
    return (<div />);
  }
}
Home.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default Home;
