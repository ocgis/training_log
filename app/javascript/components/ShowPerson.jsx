import React from "react";
import { Link } from "react-router-dom";
import 'antd/dist/antd.css';
import { Col, Row } from 'antd';
import { TrainingsList } from "./Training";
import TopMenu from "./TopMenu";


class ShowPerson extends React.Component {
    constructor(props) {
        super(props);
        this.state = { person: null };
    }

    componentDidMount() {
        const {
            match: {
                params: { id }
            }
        } = this.props;

        const url = `/api/v1/people/${id}`;

        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => {
                this.setState({ person: response });
            })
            .catch(() => this.props.history.push("/"));
    }

    render() {
        const { person } = this.state;
        const {
            match: {
                params: { id }
            }
        } = this.props;

        if (person !== null) {
            return (
                <div>
                  <TopMenu />
                  <h1>{person.name}</h1>
                  <TrainingsList trainings={person.trainings} />
                  <Link to={"/people/"+id+"/edit"}>
                    Edit
                  </Link>
                </div>
            );
        } else {
            return (
                <div>
                  <TopMenu />
                  <h1>Loading</h1>
                </div>
            );
        }
    }

}

export default ShowPerson;
