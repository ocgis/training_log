import React from "react";
import { Link } from "react-router-dom";
import TrainingForm from "./TrainingForm";

class NewTraining extends React.Component {
    constructor(props) {
        super(props);
        this.state = { training: { intervals_attributes: [] } };
    }

    render() {
        const { training } = this.state;

        return (
            <div>
              <TrainingForm training={training}/>
            </div>
        );
    }
}


export default NewTraining;
