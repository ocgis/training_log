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
    render () {
        console.log(this.props)
        return (
    <Form
      {...layout}
      action={`/trainings/${this.props.id}`}
      method="patch"
      name="training"
            initialValues={{ training: this.props.training,
                             date: moment(this.props.training.date),
                             duration_hh_mm_ss: this.props.duration_hh_mm_ss
                           }}
      onFinish={this.onFinish}
      onFinishFailed={this.onFinishFailed}
    >
      <Form.Item
        label="Kind"
        name={["training", "kind"]}
        rules={[{ required: true, message: 'Please enter kind of training!' }]}
      >
        <Input />
      </Form.Item>
            
      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: 'Please input date of training!' }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        label="Duration"
        name={["training", "duration_hh_mm_ss"]}
        rules={[{ required: false }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Distance m"
        name={["training", "distance_m"]}
        rules={[{ required: false }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name={["training", "description"]}
        rules={[{ required: false }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label="Max pulse BPM"
        name={["training", "max_pulse_bpm"]}
        rules={[{ required: false }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Average pulse BPM"
        name={["training", "avg_pulse_bpm"]}
        rules={[{ required: false }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Energy kcal"
        name={["training", "energy_kcal"]}
        rules={[{ required: false }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Intensity"
        name={["training", "intensity"]}
        rules={[{ required: false }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Alt ID"
        name={["training", "altid"]}
        rules={[{ required: false }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Route ID"
        name={["training", "route_id"]}
        rules={[{ required: false }]}
      >
        <Input />
      </Form.Item>

      <Form.List name={["training", "intervals_attributes"]}>
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field, index) => (
               <Row key={field.key}>
                  <Col>
                    <Form.Item
                      name={[field.name, "duration_hh_mm_ss"]}
                      fieldKey={[field.fieldKey, "duration_hh_mm_ss"]}
                      rules={notRequired}
                    >
                      <Input placeholder="Duration" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name={[field.name, "distance_m"]}
                      fieldKey={[field.fieldKey, "distance_m"]}
                      rules={notRequired}
                    >
                      <Input placeholder="Distance" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name={[field.name, "comment"]}
                      fieldKey={[field.fieldKey, "comment"]}
                      rules={notRequired}
                    >
                      <Input placeholder="Comment" />
                    </Form.Item>
                  </Col>
                  <Col flex="none">
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  style={{ width: '60%' }}
                >
                  <PlusOutlined /> Add interval
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <input type="submit" name="commit" value="Create training" />
    </Form>
        );
    }
    
    onFinish = values => {
        values.training.date = values.date.toISOString();
        console.log('Success:', values.training);

        const csrfToken = document.querySelector('[name=csrf-token]').content
        console.log('CSRF token:', csrfToken);
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
        if(this.props.training.id == null) {
            axios.post('/trainings', values)
                .then(resp => { console.log(resp);
                                window.location.href = "/"; })
                .catch(error => console.log(error))
        } else {
            axios.patch(`/trainings/${this.props.training.id}`, values)
                .then(resp => { console.log(resp);
                                window.location.href = `/trainings/${this.props.training.id}`; })
                .catch(error => { console.log(error) })
                      
        }
        
    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
}

export default NewTrainingForm
