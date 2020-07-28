import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

class TopMenu extends React.Component {
    render() {
        return (
            <Menu mode="horizontal">
              <Menu.Item>
                <Link to={"/"}>
                  Overview
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={"/trainings/new"}>
                  New training
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={"/rawfiles"}>
                  Uploaded files
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={"/rawfiles/new"}>
                  Upload file
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={"/routes"}>
                  Routes
                </Link>
              </Menu.Item>
              <Menu.Item>
                <a href={"/users/edit"}>
                  Edit registration
                </a>
              </Menu.Item>
              <Menu.Item>
                <a href={"/users/sign_out"} data-method="delete">
                  Logout
                </a>
              </Menu.Item>
            </Menu>
        );
    }
}

class SubmitLink extends React.Component {
    render () {
        const { to } = this.props;
    
        return (<a href={to}>
                {this.props.children}
                </a>);
    }
}

export default TopMenu;
