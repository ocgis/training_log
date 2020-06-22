import React from "react";
import axios from 'axios';

class ShowRawfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rawfile: null
        }
    }

    componentDidMount() {
        const {
            match: {
                params: { id }
            }
        } = this.props;

        const url = `/api/v1/rawfiles/${id}`;

        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => {
                this.setState({ rawfile: response });
            })
            .catch(() => this.props.history.push("/"));
    }


    render() {
        const { rawfile } = this.state;
        const {
            match: {
                params: { id }
            }
        } = this.props;

        if (rawfile !== null) {
            return (
                <div>
                  {rawfile.orig_filename}
                  <br />
                  {rawfile.content_type}
                  <br />
                  {rawfile.size}
                </div>
            );
        } else {
            return (<h1>Loading</h1>);
        }
    }
}


class UploadRawfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null
        }
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    render() {
        return (<div>
                <input type="file" name="file" onChange={this.onChangeHandler} />
                <button type="button" onClick={this.onClickHandler}>Upload</button>
                </div>);
    }

    onChangeHandler(event) {
        console.log(event.target.files);
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        });
    }

    onClickHandler() {
        const data = new FormData()
        console.log(this.state.selectedFile)
        data.append('file', this.state.selectedFile)
        data.append('last_modified', this.state.selectedFile.lastModified)
        const csrfToken = document.querySelector('[name=csrf-token]').content
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
        axios.post("/api/v1/rawfiles/upload", data, { 
            // receive two    parameter endpoint url ,form data
        }).then(res => { // then print response status
            console.log(res.statusText)
            console.log(res.data)
            window.location.href = `/rawfiles/${res.data.id}`;
        })
    }  
}

export { ShowRawfile, UploadRawfile };
