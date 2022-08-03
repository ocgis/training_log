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
          <form method="post" action="/users/sign_out">
            <input type="hidden" name="_method" value="delete" />
            <input type="hidden" name="authenticity_token" value={document.querySelector('[name=csrf-token]').content} />
            <input
              data-turbo="false"
              type="submit"
              value="Logout"
              style={{
                border: 'medium none',
                'background-color': 'inherit',
              }}
            />
          </form>
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
