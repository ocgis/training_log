import React from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Map, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { Descriptions, Table, Col, Row, Button } from 'antd';

class ShowRawfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rawfile: null,
            suggestedTrainings: null
        }
        this.connectTrainingHandler = this.connectTrainingHandler.bind(this);
    }

    componentDidMount() {
        const {
            match: {
                params: { id }
            }
        } = this.props;

        const csrfToken = document.querySelector('[name=csrf-token]').content;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

        axios.get(`/api/v1/rawfiles/${id}`)
            .then(response => {
                const rawfile = response.data;
                const date = toDateTime(rawfile.fitfile.activities[0].local_timestamp);

                const data = new FormData();
                data.append('date', date);

                axios.post("/api/v1/trainings/search", data, {
                    // receive two    parameter endpoint url ,form data
                })
                    .then(response => {
                        const suggestedTrainings = response.data.result;
                        this.setState({ rawfile: rawfile,
                                        suggestedTrainings: suggestedTrainings });
                    });
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
            // FIXME: TrainingInfo should probably go in ShowFitfile
            return (
                <div>
                  {this.trainingInfo()}
                  {rawfile.orig_filename}
                  <br />
                  {rawfile.content_type}
                  <br />
                  {rawfile.size}
                  <ShowFitfile fitfile={rawfile.fitfile} />
                </div>
            );
        } else {
            return (<h1>Loading</h1>);
        }
    }


    trainingInfo() {
        const training = this.state.rawfile.training;

        if (training == null) {
            return (<React.Fragment>
                    {this.suggestTrainings()}
                    </React.Fragment>);
        } else {
            const columns = [
                {
                    title: 'Date',
                    dataIndex: 'date'
                },
                {
                    title: 'Kind',
                    dataIndex: 'kind'
                },
                {
                    title: 'Duration',
                    dataIndex: 'duration_hh_mm_ss'
                },
                {
                    title: 'Create',
                    dataIndex: 'id',
                    render: id => (<Button onClick={this.connectTrainingHandler} data-id={null}>Detach</Button>)
                }
            ];
            return (<Table columns={columns} dataSource={[training]} rowKey="id" />);
        }
    }


    suggestTrainings() {
        const date = toDateTime(this.state.rawfile.fitfile.activities[0].local_timestamp);

        if (this.state.suggestedTrainings == null) {
            return (<h3>Loading</h3>);
        } else {
            if (this.state.suggestedTrainings.length == 0) {
                return (<h3>No matching trainings</h3>);
            } else {
                const columns = [
                    {
                        title: 'Date',
                        dataIndex: 'date'
                    },
                    {
                        title: 'Kind',
                        dataIndex: 'kind'
                    },
                    {
                        title: 'Duration',
                        dataIndex: 'duration_hh_mm_ss'
                    },
                    {
                        title: 'Create',
                        dataIndex: 'id',
                        render: id => (<Button onClick={this.connectTrainingHandler} data-id={id}>Attach</Button>)
                    }
                ];
                return (<Table columns={columns} dataSource={this.state.suggestedTrainings} rowKey="id" />);
            }
        }
    }


    connectTrainingHandler(event) {
        const id = this.state.rawfile.id;
        const data = new FormData();
        var rawfile = this.state.rawfile;

        rawfile.training_id = event.target.getAttribute('data-id');

        Object.keys(rawfile).forEach(function (key) {
            data.append('rawfile[' + key + ']', rawfile[key]);
        });

        const csrfToken = document.querySelector('[name=csrf-token]').content;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
        axios.patch(`/api/v1/rawfiles/${id}`, data, {
            // receive two    parameter endpoint url ,form data
        }).then(res => { // then print response status
            window.location.href = `/rawfiles/${res.data.id}`;
        })
    }
}


function toHHMMSS(seconds) {
    var hour = Math.floor(seconds / 60 / 60);
    var min = Math.floor(seconds / 60) % 60;
    var sec = Math.floor(seconds) % 60;
    return hour.toString().padStart(2, '0') + ':' + min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
}

function toMSS(seconds) {
    var min = Math.floor(seconds / 60);
    var sec = Math.floor(seconds) % 60;
    return min.toString() + ':' + sec.toString().padStart(2, '0');
}

function toSpeed(m_per_s) {
    return toMSS(1000.0 / m_per_s) + " /km " + "(" + (m_per_s * 3.6).toFixed(1) + " km/h)";
}

function toDateTime(ts) {
    return new Date(ts*1000).toISOString();
}

class ShowFitfile extends React.Component {
    render() {
        const { fitfile } = this.props;
        var polyline = fitfile.records.flatMap(p => p.position_lat === undefined ? [] : [[p.position_lat, p.position_long]]);
        var date = new Date(fitfile.activities[0].timestamp*1000).toISOString();
        return (<div>
                <Map center={polyline[0]} zoom={13}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <Marker position={polyline[0]}>
                <Popup>Start</Popup>
                </Marker>
                <Polyline positions={polyline} />
                </Map>
                <ActivityDescription activity={fitfile.activities[0]} />
                <SessionDescription session={fitfile.sessions[0]} />
                <LapsTable laps={fitfile.laps} />
                <EventsTable events={fitfile.events} />
                </div>);   
    }
}


class ActivityDescription extends React.Component {
    render() {
        const { activity } = this.props;
        return (<Descriptions title="Aktivitet">
                <Descriptions.Item label="Tidpunkt (lokal)">{toDateTime(activity.local_timestamp)}</Descriptions.Item>
                <Descriptions.Item label="Tidpunkt (UTC)">{toDateTime(activity.timestamp)}</Descriptions.Item>
                <Descriptions.Item label="Total tid (timer)">{toHHMMSS(activity.total_timer_time)}</Descriptions.Item>
                <Descriptions.Item label="event">{activity.event}</Descriptions.Item>
                <Descriptions.Item label="event_type">{activity.event_type}</Descriptions.Item>
                <Descriptions.Item label="type">{activity.type}</Descriptions.Item>
                </Descriptions>);
    }
}


class SessionDescription extends React.Component {
    render() {
        const { session } = this.props;
        return (<Descriptions title="Session">
                <Descriptions.Item label="Tidpunkt (UTC)">{toDateTime(session.timestamp)}</Descriptions.Item>
                <Descriptions.Item label="Starttid (UTC)">{toDateTime(session.start_time)}</Descriptions.Item>
                <Descriptions.Item label="Total tid (timer)">{toHHMMSS(session.total_timer_time)}</Descriptions.Item>
                <Descriptions.Item label="Total tid (elapsed)">{toHHMMSS(session.total_elapsed_time)}</Descriptions.Item>
                <Descriptions.Item label="Total sträcka">{session.total_distance + " m"}</Descriptions.Item>
                <Descriptions.Item label="Medelfart">{toSpeed(session.avg_speed)}</Descriptions.Item>
                <Descriptions.Item label="Maxfart">{toSpeed(session.max_speed)}</Descriptions.Item>
                <Descriptions.Item label="Antal steg">{session.total_cycles*2.0}</Descriptions.Item>
                <Descriptions.Item label="Medelkadens">{session.avg_cadence*2.0}</Descriptions.Item>
                <Descriptions.Item label="Maxkadens">{session.max_cadence*2.0}</Descriptions.Item>
                <Descriptions.Item label="Medelpuls">{session.avg_heart_rate}</Descriptions.Item>
                <Descriptions.Item label="Maxpuls">{session.max_heart_rate}</Descriptions.Item>
                <Descriptions.Item label="Uppstigning">{session.total_ascent}</Descriptions.Item>
                <Descriptions.Item label="Nedstigning">{session.total_descent}</Descriptions.Item>
                </Descriptions>);
    }
}

class LapsTable extends React.Component {
    render() {
        const { laps } = this.props;
        const columns = [
            {
                title: 'Starttid',
                dataIndex: 'start_time',
                render: t => toDateTime(t)
            },
            {
                title: 'Tid',
                dataIndex: 'total_timer_time',
                key: 'total_timer_time',
                render: t => toHHMMSS(t)
            },
            {
                title: 'Sträcka',
                dataIndex: 'total_distance',
                key: 'total_distance'
            },
            {
                title: 'Medelfart',
                dataIndex: 'avg_speed',
                key: 'avg_speed',
                render: t => toSpeed(t)
            },
            {
                title: 'Maxfart',
                dataIndex: 'max_speed',
                key: 'max_speed',
                render: t => toSpeed(t)
            },
            {
                title: 'Medelkadens',
                dataIndex: 'avg_cadence',
                render: t => t*2
            },
            {
                title: 'Maxkadens',
                dataIndex: 'max_cadence',
                render: t => t*2
            },
            {
                title: 'Medelpuls',
                dataIndex: 'avg_heart_rate'
            },
            {
                title: 'Maxpuls',
                dataIndex: 'max_heart_rate'
            },
        ];
        return (<Table columns={columns} dataSource={laps} rowKey="timestamp" />);
    }
}


class EventsTable extends React.Component {
    render() {
        const { events } = this.props;
        const columns = [
            {
                title: 'Sluttid',
                dataIndex: 'timestamp',
                render: t => toDateTime(t)
            },
            {
                title: 'event',
                dataIndex: 'event'
            },
            {
                title: 'event_group',
                dataIndex: 'event_group'
            },
            {
                title: 'event_type',
                dataIndex: 'event_type'
            },
            {
                title: 'data',
                dataIndex: 'data'
            }
        ];
        return (<Table columns={columns} dataSource={events} rowKey="timestamp" />);
    }
}


class UploadRawfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null
        };
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
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        });
    }

    onClickHandler() {
        const data = new FormData();
        data.append('file', this.state.selectedFile);
        data.append('last_modified', this.state.selectedFile.lastModified);
        const csrfToken = document.querySelector('[name=csrf-token]').content;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
        axios.post("/api/v1/rawfiles/upload", data, {
            // receive two    parameter endpoint url ,form data
        }).then(res => { // then print response status
            window.location.href = `/rawfiles/${res.data.id}`;
        })
    }  
}


class IndexRawfiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = { rawfiles: null };
    }

    componentDidMount() {
        const url = `/api/v1/rawfiles`;

        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => {
                this.setState({ rawfiles: response });
            })
            .catch(() => this.props.history.push("/"));
    }

    render() {
        const { rawfiles } = this.state;

        if (rawfiles !== null) {
            return (
                <div>
                  <h1>Uploaded files</h1>
                  {this.renderRawfiles(rawfiles)}
                </div>
            );
        } else {
            return (<h1>Loading</h1>);
        }
    }

    renderRawfiles(rawfiles) {
        if (rawfiles.length > 0) {
            return (<div>
                    {
                        rawfiles.map((rawfile, index) =>
                                     {
                                         return this.renderRawfile(rawfile, index);
                                     }
                                    )
                    }
                    </div>
                   );
        } else {
            return null;
        }
    }


    renderRawfile(rawfile, index) {
        return (
            <div key={index}>
              <Link to={"/rawfiles/"+rawfile.id}>
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
                </Row>
              </Link>
            </div>
        );
    }
}


export { ShowRawfile, UploadRawfile, IndexRawfiles };
