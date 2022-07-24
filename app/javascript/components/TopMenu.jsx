import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

function TopMenu() {
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
        <a href="/users/sign_out" data-method="delete">
          Logout
        </a>
      </Menu.Item>
    </Menu>
  );
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
