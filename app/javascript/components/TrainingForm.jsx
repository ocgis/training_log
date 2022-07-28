import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import 'antd/dist/antd.css';
import {
  Form, DatePicker, Input, Button, Col, Row,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { toHHMMSS, toS } from './Conversions';

const notRequired = [{ required: false }];

const layout = {
  layout: 'vertical',
};

class TrainingForm extends React.Component {
  constructor(props) {
    super(props);

    const mapTraining = () => {
      const mapInterval = (interval) => {
        const { duration_s, ...newInterval } = {
          ...interval,
          durationHHMMSS: toHHMMSS(interval.duration_s),
        };

        return newInterval;
      };

      const { training } = this.props;
      const { duration_s, ...newTraining } = {
        ...training,
        date: moment(training.date),
        durationHHMMSS: toHHMMSS(training.duration_s),
        intervals_attributes: training.intervals_attributes.map(mapInterval),
      };

      return newTraining;
    };

    this.state = { training: mapTraining() };

    this.emptyInterval = {
      durationHHMMSS: '',
      distance_m: '',
      comment: '',
      _destroy: 0,
    };
  }

  renderInterval(interval, index) {
    const updateInterval = (toUpdate) => {
      this.setState((prevState) => ({
        training: {
          ...prevState.training,
          intervals_attributes: [
            ...prevState.training.intervals_attributes.slice(0, index),
            {
              ...prevState.training.intervals_attributes[index],
              ...toUpdate,
            },
            ...prevState.training.intervals_attributes.slice(index + 1),
          ],
        },
      }));
    };

    if (!interval._destroy) {
      return (
        <Row key={index}>
          <Col span={7}>
            <Form.Item
              name={['training', 'intervals_attributes', index, 'durationHHMMSS']}
              rules={notRequired}
              onChange={(event) => {
                updateInterval({ durationHHMMSS: event.target.value });
              }}
            >
              <Input placeholder="Duration" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name={['training', 'intervals_attributes', index, 'distance_m']}
              rules={notRequired}
              onChange={(event) => {
                updateInterval({ distance_m: event.target.value });
              }}
            >
              <Input placeholder="Distance" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name={['training', 'intervals_attributes', index, 'comment']}
              rules={notRequired}
              onChange={(event) => {
                updateInterval({ comment: event.target.value });
              }}
            >
              <Input placeholder="Comment" />
            </Form.Item>
          </Col>
          <Col flex="none">
            <MinusCircleOutlined
              className="dynamic-delete-button"
              onClick={() => {
                updateInterval({ _destroy: 1 });
              }}
            />
          </Col>
        </Row>
      );
    }
    return null;
  }

  render() {
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    const onFinish = () => {
      const mapTraining = () => {
        const mapInterval = (interval) => {
          const { durationHHMMSS, ...newInterval } = {
            ...interval,
            duration_s: toS(interval.durationHHMMSS),
          };

          return newInterval;
        };

        const { training } = this.state;
        const { durationHHMMSS, ...newTraining } = {
          ...training,
          date: moment(training.date),
          duration_s: toS(training.durationHHMMSS),
          intervals_attributes: training.intervals_attributes.map(mapInterval),
        };

        return newTraining;
      };

      const { training: formTraining } = this.state;
      const { afterSubmit } = this.props;

      const training = mapTraining(formTraining);

      const csrfToken = document.querySelector('[name=csrf-token]').content;
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
      if (training.id == null) {
        axios
          .post('/api/v1/trainings', { training })
          .then((resp) => {
            afterSubmit(resp);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .patch(`/api/v1/trainings/${training.id}`, { training })
          .then((resp) => {
            afterSubmit(resp);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    const { training } = this.state;

    return (
      <Form
        {...layout}
        name="training"
        initialValues={{ training }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Kind"
          name={['training', 'kind']}
          rules={[{ required: true, message: 'Please enter kind of training!' }]}
          onChange={(event) => {
            training.kind = event.target.value;
          }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Date"
          name={['training', 'date']}
          rules={[{ required: true, message: 'Please input date of training!' }]}
        >
          <DatePicker
            onChange={(date, dateString) => {
              training.date = dateString;
            }}
          />
        </Form.Item>

        <Form.Item
          label="Duration"
          name={['training', 'durationHHMMSS']}
          rules={[{ required: false }]}
          onChange={
          (event) => {
            training.durationHHMMSS = event.target.value;
          }
          }
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Distance m"
          name={['training', 'distance_m']}
          rules={[{ required: false }]}
          onChange={
          (event) => {
            training.distance_m = event.target.value;
          }
          }
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name={['training', 'description']}
          rules={[{ required: false }]}
          onChange={
          (event) => {
            training.description = event.target.value;
          }
          }
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Max pulse BPM"
          name={['training', 'max_pulse_bpm']}
          rules={[{ required: false }]}
          onChange={
          (event) => {
            training.max_pulse_bpm = event.target.value;
          }
          }
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Average pulse BPM"
          name={['training', 'avg_pulse_bpm']}
          rules={[{ required: false }]}
          onChange={
          (event) => {
            training.avg_pulse_bpm = event.target.value;
          }
          }
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Energy kcal"
          name={['training', 'energy_kcal']}
          rules={[{ required: false }]}
          onChange={
          (event) => {
            training.energy_kcal = event.target.value;
          }
          }
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Intensity"
          name={['training', 'intensity']}
          rules={[{ required: false }]}
          onChange={
          (event) => {
            training.intensity = event.target.value;
          }
          }
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Alt ID"
          name={['training', 'altid']}
          rules={[{ required: false }]}
          onChange={
          (event) => {
            training.altid = event.target.value;
          }
          }
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Route ID"
          name={['training', 'route_id']}
          rules={[{ required: false }]}
          onChange={
          (event) => {
            training.route_id = event.target.value;
          }
          }
        >
          <Input />
        </Form.Item>

        { training.intervals_attributes.map((interval, index) => (
          this.renderInterval(interval, index))) }
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => {
              this.setState((prevState) => ({
                training: {
                  ...prevState.training,
                  intervals_attributes: [
                    ...prevState.training.intervals_attributes,
                    { ...this.emptyInterval },
                  ],
                },
              }));
            }}
            style={{ width: '100%' }}
          >
            <PlusOutlined />
            Add interval
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create training
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
TrainingForm.propTypes = {
  training: PropTypes.shape().isRequired,
  afterSubmit: PropTypes.func.isRequired,
};

export default TrainingForm;
