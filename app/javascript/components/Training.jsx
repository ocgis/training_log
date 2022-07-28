import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Col, Row } from 'antd';
import { distanceDurationToSpeed, toHHMMSS, toKm, toYYYYMMDD } from './Conversions';

function Description(props) {
  const {
    id,
    description,
  } = props;

  if (description != null) {
    return (
      <>
        {
          description.split('\n').map((line, index) => (
            <Row key={`${id}_${index}`}>
              <Col xs={5} sm={3} md={3} lg={2} xl={2} />
              <Col>
                { line }
              </Col>
            </Row>
          ))
        }
      </>
    );
  }
  return null;
}
Description.propTypes = {
  id: PropTypes.number.isRequired,
  description: PropTypes.string,
};
Description.defaultProps = {
  description: null,
};

function TrainingsListItem(props) {
  const { training } = props;

  const date = toYYYYMMDD(training.date);

  return (
    <div>
      <Link to={`/trainings/${training.id}`}>
        <Row>
          <Col xs={5} sm={3} md={3} lg={2} xl={2}>
            {date}
          </Col>
          <Col xs={5} sm={3} md={3} lg={2} xl={2}>
            {training.kind}
          </Col>
          <Col xs={5} sm={3} md={3} lg={2} xl={2}>
            {toHHMMSS(training.duration_s)}
          </Col>
          <Col xs={5} sm={3} md={3} lg={2} xl={2}>
            {toKm(training.distance_m)}
          </Col>
          <Col>
            {distanceDurationToSpeed(training.distance_m, training.duration_s)}
          </Col>
        </Row>
        <Description id={training.id} description={training.description} />
      </Link>
    </div>
  );
}
TrainingsListItem.propTypes = {
  training: PropTypes.shape().isRequired,
};

function TrainingsList(props) {
  const { trainings } = props;
  if (trainings.length > 0) {
    return (
      <div>
        <h2>Trainings</h2>
        {
          trainings.map((training) => (
            <TrainingsListItem key={training.id} training={training} />
          ))
        }
      </div>
    );
  }
  return null;
}
TrainingsList.propTypes = {
  trainings: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export { TrainingsList, TrainingsListItem };
