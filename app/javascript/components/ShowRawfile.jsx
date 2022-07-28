import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Table, Button } from 'antd';
import { TrainingsListItem } from './Training';
import { Rawfile, toDateTime } from './Rawfile';
import { toHHMMSS } from './Conversions';
import TrainingForm from './TrainingForm';
import TopMenu from './TopMenu';

class ShowRawfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rawfile: null,
      suggestedTrainings: null,
      createNewTraining: false,
    };
    this.connectTrainingHandler = this.connectTrainingHandler.bind(this);
    this.afterSubmitTraining = this.afterSubmitTraining.bind(this);
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      history,
    } = this.props;

    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    axios
      .get(`/api/v1/rawfiles/${id}`)
      .then((firstResponse) => {
        const rawfile = firstResponse.data;
        const date = toDateTime(rawfile.fitfile.activities[0].local_timestamp);

        const data = new FormData();
        data.append('date', date);

        axios
          .post('/api/v1/trainings/search', data, {
            // receive two    parameter endpoint url ,form data
          })
          .then((secondResponse) => {
            const suggestedTrainings = secondResponse.data.result;
            this.setState({
              rawfile,
              suggestedTrainings,
            });
          });
      })
      .catch(() => history.push('/'));
  }

  suggestTrainings = () => {
    const { createNewTraining, rawfile, suggestedTrainings } = this.state;
    // Remove? const date = toDateTime(this.state.rawfile.fitfile.activities[0].local_timestamp);

    if (suggestedTrainings == null) {
      return (
        <h3>Loading</h3>
      );
    }
    if (createNewTraining) {
      const activity = rawfile.fitfile.activities[0];
      const session = rawfile.fitfile.sessions[0];
      const { laps } = rawfile.fitfile;
      const training = {
        kind: 'Löpning', // FIXME
        date: toDateTime(activity.local_timestamp),
        duration_s: activity.total_timer_time,
        distance_m: session.total_distance,
        max_pulse_bpm: session.max_heart_rate,
        avg_pulse_bpm: session.avg_heart_rate,
        energy_kcal: session.total_calories,
        intensity: session.total_training_effect,
        intervals_attributes: laps.map((lap) => ({
          _destroy: false,
          duration_s: lap.total_timer_time,
          distance_m: lap.total_distance,
        })),
      };
      return (
        <div>
          <TrainingForm training={training} afterSubmit={this.afterSubmitTraining} />
          {this.cancelNewTrainingButton()}
        </div>
      );
    }

    if (suggestedTrainings.length === 0) {
      return this.createNewTrainingButton();
    }

    const columns = [
      {
        title: 'Date',
        dataIndex: 'date',
      },
      {
        title: 'Kind',
        dataIndex: 'kind',
      },
      {
        title: 'Duration',
        dataIndex: 'durationHHMMSS',
      },
      {
        title: 'Create',
        dataIndex: 'id',
        render: (id) => (
          <Button onClick={this.connectTrainingHandler} data-id={id}>Attach</Button>
        ),
      },
    ];
    return (
      <>
        {this.createNewTrainingButton()}
        <Table columns={columns} dataSource={suggestedTrainings} rowKey="id" />
      </>
    );
  };

  createNewTrainingButton = () => (
    <Button
      onClick={() => {
        this.setState({ createNewTraining: true });
      }}
    >
      Create new training
    </Button>
  );

  cancelNewTrainingButton = () => (
    <Button onClick={() => {
      this.setState({ createNewTraining: false });
    }}
    >
      Cancel
    </Button>
  );

  connectTrainingHandler = (event) => {
    this.patchTrainingId(event.target.getAttribute('data-id'));
  };

  afterSubmitTraining = (response) => {
    const training = response.data;
    this.patchTrainingId(training.id);
  };

  patchTrainingId = (trainingId) => {
    const { rawfile } = this.state;
    const data = new URLSearchParams();

    rawfile.training_id = trainingId;

    Object.keys(rawfile).forEach((key) => {
      data.append(`rawfile[${key}]`, rawfile[key]);
    });

    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    axios
      .patch(`/api/v1/rawfiles/${rawfile.id}`, data, {})
      .then((response) => {
        this.setState({ rawfile: response.data });
      });
  };

  trainingInfo = () => {
    const { rawfile: { training } } = this.state;

    if (training == null) {
      return (
        <>
          {this.suggestTrainings()}
        </>
      );
    }
    return (
      <div>
        <TrainingsListItem key="1" training={training} />
        <Button onClick={this.connectTrainingHandler} data-id={null}>Detach training</Button>
      </div>
    );
  };

  render() {
    const { rawfile } = this.state;

    if (rawfile !== null) {
      // FIXME: TrainingInfo should probably go in ShowFitfile
      return (
        <div>
          <TopMenu />
          {this.trainingInfo()}
          <Rawfile rawfile={rawfile} />
        </div>
      );
    }
    return (
      <div>
        <TopMenu />
        <h1>Loading</h1>
      </div>
    );
  }
}
ShowRawfile.propTypes = {
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default ShowRawfile;
