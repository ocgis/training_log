import React from "react";
import { Link } from "react-router-dom";

class TopMenu extends React.Component {
    render() {
        return (
            <div>
              <Link to={"/"}>
                Overview
              </Link>
              <Link to={"/trainings/new"}>
                New training
              </Link>
              <Link to={"/rawfiles"}>
                Uploaded files
              </Link>
              <Link to={"/rawfiles/new"}>
                Upload file
              </Link>
              <Link to={"/routes"}>
                Routes
              </Link>
              <a href={"/users/edit"}>
                Edit registration
              </a>
              <a href={"/users/sign_out"} data-method="delete">
                Logout
              </a>
            </div>
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
