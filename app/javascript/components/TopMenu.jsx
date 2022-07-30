import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Menu } from 'antd';

class TopMenu extends React.Component {
  render() {
    return (
      <Menu mode="horizontal">
        <Menu.Item>
          <Link to="/">
            Overview
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/trainings/new">
            New training
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/rawfiles">
            Uploaded files
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/rawfiles/new">
            Upload file
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/routes">
            Routes
          </Link>
        </Menu.Item>
        <Menu.Item>
          <a href="/users/edit">
            Edit registration
          </a>
        </Menu.Item>
        <Menu.Item>
          <Button
            onClick={() => {
              const csrfToken = document.querySelector('[name=csrf-token]').content;
              axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
              axios
                .delete('/users/sign_out')
                .then((response) => {
                  this.ct_body = response.data;
                });
              alert('bah');
            }}
            style={{ border: 'none' }}
          >
            Logout
          </Button>
        </Menu.Item>
      </Menu>
    );
  }
}

function SubmitLink(props) {
  const { children, to } = props;

  return (
    <a href={to}>
      {children}
    </a>
  );
}
SubmitLink.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

export default TopMenu;
