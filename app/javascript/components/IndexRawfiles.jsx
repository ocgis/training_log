import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Row } from 'antd';
import TopMenu from './TopMenu';

const renderRawfile = (rawfile, index) => (
  <div key={index}>
    <Link to={`/rawfiles/${rawfile.id}`}>
      <Row>
        <Col xs={7} sm={5} md={5} lg={4} xl={4}>
          {rawfile.orig_filename}
        </Col>
        <Col xs={7} sm={5} md={5} lg={4} xl={4}>
          {rawfile.content_type}
        </Col>
        <Col xs={5} sm={3} md={3} lg={2} xl={2}>
          {rawfile.size}
        </Col>
        <Col xs={5} sm={3} md={3} lg={2} xl={2}>
          {rawfile.training_id}
        </Col>
      </Row>
    </Link>
  </div>
);

const renderRawfiles = (rawfiles) => {
  if (rawfiles.length > 0) {
    return (
      <div>
        { rawfiles.map((rawfile, index) => renderRawfile(rawfile, index)) }
      </div>
    );
  }
  return null;
};

class IndexRawfiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rawfiles: null };
  }

  componentDidMount() {
    const { navigate } = this.props;
    const url = '/api/v1/rawfiles';

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((response) => {
        this.setState({ rawfiles: response });
      })
      .catch(() => navigate('/'));
  }

  render() {
    const { rawfiles } = this.state;

    if (rawfiles !== null) {
      return (
        <div>
          <TopMenu />
          <h1>Uploaded files</h1>
          {renderRawfiles(rawfiles)}
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
IndexRawfiles.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default function wrapper() {
  return (
    <IndexRawfiles
      navigate={useNavigate()}
    />
  );
}
