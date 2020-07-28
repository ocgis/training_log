import React from "react";
import axios from 'axios';
import { Link } from "react-router-dom";


class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const csrfToken = document.querySelector('[name=csrf-token]').content;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

        axios.get('/api/v1/people/current_person')
            .then(response => {
                const current_person = response.data;
                if (current_person == null) {
                    this.props.history.push('/people/new');
                } else {
                    this.props.history.push(`/people/${current_person}`);
                }
            });
    }


    render () {
        return (<div></div>);
    }
}

export default Home;
