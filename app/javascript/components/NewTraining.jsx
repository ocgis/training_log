import React from "react";
import { Link } from "react-router-dom";
import TrainingForm from "./TrainingForm";

class NewTraining extends React.Component {
    constructor(props) {
        super(props);
        this.state = { training: { intervals_attributes: [] } };
        this.afterSubmit = this.afterSubmit.bind(this);
    }

    render() {
        const { training } = this.state;

        return (
            <div>
              <TrainingForm training={training} afterSubmit={this.afterSubmit} />
            </div>
        );
    }


    afterSubmit(resp) {
        window.location.href = "/";
    }
}


export default NewTraining;
