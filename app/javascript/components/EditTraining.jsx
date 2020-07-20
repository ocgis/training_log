import React from "react";
import { Link } from "react-router-dom";
import TrainingForm from "./TrainingForm";

class EditTraining extends React.Component {
    constructor(props) {
        super(props);
        this.state = { training: null };
        this.afterSubmit = this.afterSubmit.bind(this);
    }

    componentDidMount() {
        const {
            match: {
                params: { id }
            }
        } = this.props;

        const url = `/api/v1/trainings/${id}`;

        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => {
                this.setState({ training: response });
            })
            .catch(() => this.props.history.push("/"));
    }

    render() {
        const { training } = this.state;
        const {
            match: {
                params: { id }
            }
        } = this.props;

        if (training !== null) {
            return (
                <div>
                  <TrainingForm training={training} afterSubmit={this.afterSubmit} />
                </div>
            );
        } else {
            return (<h1>Loading...</h1>);
        }
    }


    afterSubmit(response) {
        const training = response.data;
        window.location.href = `/trainings/${training.id}`;
    }
}


export default EditTraining;
