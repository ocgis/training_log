import React from 'react';
import TrainingForm from './TrainingForm';
import TopMenu from './TopMenu';

class NewTraining extends React.Component {
  constructor(props) {
    super(props);
    this.state = { training: { intervals_attributes: [] } };
    this.afterSubmit = this.afterSubmit.bind(this);
  }

  render() {
    const afterSubmit = () => {
      window.location.href = '/';
    };

    const { training } = this.state;

    return (
      <div>
        <TopMenu />
        <TrainingForm training={training} afterSubmit={afterSubmit} />
      </div>
    );
  }
}

export default NewTraining;
