import React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from 'antd';


class TrainingsList extends React.Component {
    render() {
        const { trainings } = this.props;
        if (trainings.length > 0) {
            return (<div>
                    <h2>Trainings</h2>
                    {
                        trainings.map((training, index) =>
                                      {
                                          return (<TrainingsListItem key={index} training={training} />);
                                      })
                    }
                    </div>
                   );
        } else {
            return null;
        }
    }
}


class TrainingsListItem extends React.Component {
    render() {
        const { training } = this.props;
        return (
            <div>
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
                <Description description={training.description} />
              </Link>
            </div>
        );
    }
}


class Description extends React.Component {
    render() {
        const {
            description
        } = this.props;

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

export { TrainingsList }
