import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

function TopMenu() {
  return (
    <Menu mode="horizontal">
      <Menu.Item key="overview">
        <Link to="/">
          Overview
        </Link>
      </Menu.Item>
      <Menu.Item key="newTraining">
        <Link to="/trainings/new">
          New training
        </Link>
      </Menu.Item>
      <Menu.Item key="uploadedFiles">
        <Link to="/rawfiles">
          Uploaded files
        </Link>
      </Menu.Item>
      <Menu.Item key="uploadFile">
        <Link to="/rawfiles/new">
          Upload file
        </Link>
      </Menu.Item>
      <Menu.Item key="routes">
        <Link to="/routes">
          Routes
        </Link>
      </Menu.Item>
      <Menu.Item key="editRegistration">
        <a href="/users/edit">
          Edit registration
        </a>
      </Menu.Item>
      <Menu.Item key="logout">
        <form method="post" action="/users/sign_out">
          <input type="hidden" name="_method" value="delete" />
          <input type="hidden" name="authenticity_token" value={document.querySelector('[name=csrf-token]').content} />
          <input
            data-turbo="false"
            type="submit"
            value="Logout"
            style={{
              border: 'medium none',
              backgroundColor: 'inherit',
            }}
          />
        </form>
      </Menu.Item>
    </Menu>
  );
}

function SubmitLink(props) {
  const { items, to } = props;

  return (
    <a href={to}>
      {items}
    </a>
  );
}
SubmitLink.propTypes = {
  items: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

export default TopMenu;
