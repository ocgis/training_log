import React from 'react';
import axios from 'axios';
import moment from 'moment';
import 'antd/dist/antd.css';
import { Form, DatePicker, Input, Button, Checkbox, Col, Row } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const rules = [{ required: true }];
const notRequired = [{ required: false }];

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

class NewTrainingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = JSON.parse(JSON.stringify(this.props));
        this.state.training.date = moment(this.props.training.date);
        this.emptyInterval = {
            duration_hh_mm_ss: '',
            distance_m: '',
            comment: '',
            _destroy: 0
        };
    }

    render () {
        return (<Form
                {...layout}
                action={`/trainings/${this.props.id}`}
                method="patch"
                name="training"
                initialValues={{ training: this.state.training }}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                >
                <Form.Item
                label="Kind"
                name={["training", "kind"]}
                rules={[{ required: true, message: 'Please enter kind of training!' }]}
                onChange={
                    (event) => {
                        this.state.training.kind = event.target.value;
                    }
                }
                >
                <Input />
                </Form.Item>
            
                <Form.Item
                label="Date"
                name={["training", "date"]}
                rules={[{ required: true, message: 'Please input date of training!' }]}
                >
                <DatePicker
                onChange={
                    (date, dateString) => {
                        this.state.training.date = dateString;
                    }
                }
                />
                </Form.Item>

                <Form.Item
                label="Duration"
                name={["training", "duration_hh_mm_ss"]}
                rules={[{ required: false }]}
                onChange={
                    (event) => {
                        this.state.training.duration_hh_mm_ss = event.target.value;
                    }
                }
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Distance m"
                name={["training", "distance_m"]}
                rules={[{ required: false }]}
                onChange={
                    (event) => {
                        this.state.training.distance_m = event.target.value;
                    }
                }
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Description"
                name={["training", "description"]}
                rules={[{ required: false }]}
                onChange={
                    (event) => {
                        this.state.training.description = event.target.value;
                    }
                }
                >
                <Input.TextArea />
                </Form.Item>

                <Form.Item
                label="Max pulse BPM"
                name={["training", "max_pulse_bpm"]}
                rules={[{ required: false }]}
                onChange={
                    (event) => {
                        this.state.training.max_pulse_bpm = event.target.value;
                    }
                }
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Average pulse BPM"
                name={["training", "avg_pulse_bpm"]}
                rules={[{ required: false }]}
                onChange={
                    (event) => {
                        this.state.training.avg_pulse_bpm = event.target.value;
                    }
                }
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Energy kcal"
                name={["training", "energy_kcal"]}
                rules={[{ required: false }]}
                onChange={
                    (event) => {
                        this.state.training.energy_kcal = event.target.value;
                    }
                }
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Intensity"
                name={["training", "intensity"]}
                rules={[{ required: false }]}
                onChange={
                    (event) => {
                        this.state.training.intensity = event.target.value;
                    }
                }
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Alt ID"
                name={["training", "altid"]}
                rules={[{ required: false }]}
                onChange={
                    (event) => {
                        this.state.training.altid = event.target.value;
                    }
                }
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Route ID"
                name={["training", "route_id"]}
                rules={[{ required: false }]}
                onChange={
                    (event) => {
                        this.state.training.route_id = event.target.value;
                    }
                }
                >
                <Input />
                </Form.Item>

                { this.state.training.intervals_attributes.map((interval, index) => { return this.renderInterval(interval, index);
                                                                                    } ) }
                <Form.Item>
                <Button
                type="dashed"
                onClick={() => {
                    this.state.training.intervals_attributes.push(Object.assign({}, this.emptyInterval));

                    this.setState({ training: this.state.training });
                }}
                style={{ width: '60%' }}
                >
                <PlusOutlined /> Add interval
                </Button>
                </Form.Item>

                <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                Submit
                </Button>
                </Form.Item>
                <input type="submit" name="commit" value="Create training" />
                </Form>
               );
    }

    renderInterval(interval, index) {
        if (!interval._destroy) {
            return (<Row key={index}>
                    <Col>
                    <Form.Item
                    name={["training", "intervals_attributes", index, "duration_hh_mm_ss"]}
                    rules={notRequired}
                    onChange={
                        (event) => {
                            interval.duration_hh_mm_ss = event.target.value;
                        }
                    }
                    >
                    <Input placeholder="Duration" />
                    </Form.Item>
                    </Col>
                    <Col>
                    <Form.Item
                    name={["training", "intervals_attributes", index, "distance_m"]}
                    rules={notRequired}
                    onChange={
                        (event) => {
                            interval.distance_m = event.target.value;
                        }
                    }
                    >
                    <Input placeholder="Distance" />
                    </Form.Item>
                    </Col>
                    <Col>
                    <Form.Item
                    name={["training", "intervals_attributes", index, "comment"]}
                    rules={notRequired}
                    onChange={
                        (event) => {
                            interval.comment = event.target.value;
                        }
                    }
                    >
                    <Input placeholder="Comment" />
                    </Form.Item>
                    </Col>
                    <Col flex="none">
                    <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => {
                        interval._destroy = 1;
                        this.setState({training: this.state.training});
                    }}
                    />
                    </Col>
                    </Row>
                   );
        } else {
            return null;
        }
    }

    onFinish = values => {
        values.training.date = values.training.date.toISOString();
        console.log('Success:', values.training);
        console.log('State:', this.state.training);

        const csrfToken = document.querySelector('[name=csrf-token]').content
        console.log('CSRF token:', csrfToken);
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
        if(this.props.id == null) {
            axios.post('/trainings', this.state)
                .then(resp => { console.log(resp);
                                window.location.href = "/"; })
                .catch(error => console.log(error))
        } else {
            axios.patch(`/trainings/${this.props.id}`, this.state)
                .then(resp => { console.log(resp);
                                window.location.href = `/trainings/${this.props.id}`;
                              })
                .catch(error => { console.log(error) })
                      
        }
        
    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
}

export default NewTrainingForm