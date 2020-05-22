import React from "react";
import { Link } from "react-router-dom";
import 'antd/dist/antd.css';
import { Col, Row } from 'antd';

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
                  <h1>{person.name}</h1>
                  {this.renderTrainings(person.trainings)}
                  <Link to={"/people/"+id+"/edit"}>
                    Edit
                  </Link>
                </div>
            );
        } else {
            return (<h1>Loading</h1>);
        }
    }

    renderTrainings(trainings) {
        if (trainings.length > 0) {
            return (<div>
                    <h2>Trainings</h2>
                    {
                        trainings.map((training, index) =>
                                      {
                                          return this.renderTraining(training, index);
                                      }
                                     )
                    }
                    </div>
                   );
        } else {
            return null;
        }
    }


    renderTraining(training, index) {
        return (
            <div key={index}>
                  <Link to={"/trainings/"+training.id}>
              <Row>
                <Col xs={5} sm={3} md={3} lg={2} xl={2}>
                    {training.date_yyyy_mm_dd}
                </Col>
                <Col xs={5} sm={3} md={3} lg={2} xl={2}>
                    {training.kind}
                </Col>
                <Col xs={5} sm={3} md={3} lg={2} xl={2}>
                  {training.duration_hh_mm_ss}
                </Col>
                <Col>
                  {training.distance_km}
                </Col>
              </Row>
              {this.renderDescription(training.description)}
                  </Link>
            </div>
        );
    }


    renderDescription(description) {
        if (description != null) {
            return (
                <React.Fragment>
                  { description.split('\n').map((line, index) =>
                                                {
                                                    return (
                                                        <Row key={index}>
                                                          <Col xs={5} sm={3} md={3} lg={2} xl={2}/>
                                                          <Col>
                                                            { line }
                                                          </Col>
                                                        </Row>
                                                    );
                                                }
                                               )
                  }
                </React.Fragment>
            );
        } else {
            return null;
        }
    }
}

export default ShowPerson;
