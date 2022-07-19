import React from 'react';
import axios from 'axios';
import TopMenu from './TopMenu';

class UploadRawfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFiles: null,
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  onChangeHandler(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }

  onClickHandler() {
    const data = new FormData();
    const { selectedFiles: files } = this.state;
    for (let i = 0; i < files.length; i += 1) {
      data.append('files[][file]', files[i]);
      data.append('files[][last_modified]', files[i].lastModified);
    }

    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    axios
      .post('/api/v1/rawfiles/upload', data, {})
      .then((response) => {
        const { rawfiles } = response.data;

        if (rawfiles.length === 1) {
          window.location.href = `/rawfiles/${rawfiles[0].id}`;
        } else {
          window.location.href = '/rawfiles';
        }
      });
  }

  render() {
    return (
      <div>
        <TopMenu />
        <input type="file" name="file" onChange={this.onChangeHandler} multiple />
        <button type="button" onClick={this.onClickHandler}>Upload</button>
      </div>
    );
  }
}

export default UploadRawfile;
