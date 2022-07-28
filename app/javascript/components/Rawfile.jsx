import React from 'react';
import PropTypes from 'prop-types';
import {
  Map, Marker, Polyline, Popup, TileLayer,
} from 'react-leaflet';
import { Descriptions, Table } from 'antd';
import { toHHMMSS, toSpeed } from './Conversions';

function toDateTime(ts) {
  return new Date(ts * 1000).toISOString();
}

function toSport(s) {
  const intToStr = {
    0: 'generic',
    1: 'running',
    2: 'cycling',
    5: 'swimming',
    11: 'walking',
  };

  if (s in intToStr) {
    return intToStr[s];
  }
  return s;
}

function toEvent(e) {
  const intToStr = {
    0: 'timer',
    9: 'lap',
  };

  if (e in intToStr) {
    return intToStr[e];
  }
  return e;
}

function toEventType(e) {
  const intToStr = {
    0: 'start',
    1: 'stop',
    3: 'marker',
    4: 'stop_all',
  };

  if (e in intToStr) {
    return intToStr[e];
  }
  return e;
}

function toLapTrigger(t) {
  const intToStr = {
    0: 'manual',
    2: 'distance',
    7: 'session_end',
  };

  if (t in intToStr) {
    return intToStr[t];
  }
  return t;
}

function ActivityDescription(props) {
  const { activity } = props;
  return (
    <Descriptions title="Aktivitet">
      <Descriptions.Item label="Tidpunkt (lokal)">{toDateTime(activity.local_timestamp)}</Descriptions.Item>
      <Descriptions.Item label="Tidpunkt (UTC)">{toDateTime(activity.timestamp)}</Descriptions.Item>
      <Descriptions.Item label="Total tid (timer)">{toHHMMSS(activity.total_timer_time)}</Descriptions.Item>
      <Descriptions.Item label="event">{activity.event}</Descriptions.Item>
      <Descriptions.Item label="event_type">{activity.event_type}</Descriptions.Item>
      <Descriptions.Item label="type">{activity.type}</Descriptions.Item>
    </Descriptions>
  );
}
ActivityDescription.propTypes = {
  activity: PropTypes.shape().isRequired,
};

function SessionDescription(props) {
  const { session } = props;
  return (
    <Descriptions title="Session">
      <Descriptions.Item label="Tidpunkt (UTC)">{toDateTime(session.timestamp)}</Descriptions.Item>
      <Descriptions.Item label="Starttid (UTC)">{toDateTime(session.start_time)}</Descriptions.Item>
      <Descriptions.Item label="Sport">{toSport(session.sport)}</Descriptions.Item>
      <Descriptions.Item label="Total tid (timer)">{toHHMMSS(session.total_timer_time)}</Descriptions.Item>
      <Descriptions.Item label="Total tid (elapsed)">{toHHMMSS(session.total_elapsed_time)}</Descriptions.Item>
      <Descriptions.Item label="Total sträcka">{`${session.total_distance} m`}</Descriptions.Item>
      <Descriptions.Item label="Medelfart">{toSpeed(session.avg_speed)}</Descriptions.Item>
      <Descriptions.Item label="Maxfart">{toSpeed(session.max_speed)}</Descriptions.Item>
      <Descriptions.Item label="Antal steg">{session.total_cycles * 2.0}</Descriptions.Item>
      <Descriptions.Item label="Medelkadens">{session.avg_cadence * 2.0}</Descriptions.Item>
      <Descriptions.Item label="Maxkadens">{session.max_cadence * 2.0}</Descriptions.Item>
      <Descriptions.Item label="Medelpuls">{session.avg_heart_rate}</Descriptions.Item>
      <Descriptions.Item label="Maxpuls">{session.max_heart_rate}</Descriptions.Item>
      <Descriptions.Item label="Uppstigning">{session.total_ascent}</Descriptions.Item>
      <Descriptions.Item label="Nedstigning">{session.total_descent}</Descriptions.Item>
      <Descriptions.Item label="Energiförbrukning">{`${session.total_calories} kcal`}</Descriptions.Item>
      <Descriptions.Item label="Intensitet">{session.total_training_effect}</Descriptions.Item>
    </Descriptions>
  );
}
SessionDescription.propTypes = {
  session: PropTypes.shape().isRequired,
};

function LapsTable(props) {
  const { laps } = props;
  const columns = [
    {
      title: 'Starttid',
      dataIndex: 'start_time',
      render: (t) => toDateTime(t),
    },
    {
      title: 'Event',
      dataIndex: 'event',
      render: (e) => toEvent(e),
    },
    {
      title: 'Event type',
      dataIndex: 'event_type',
      render: (e) => toEventType(e),
    },
    {
      title: 'Lap trigger',
      dataIndex: 'lap_trigger',
      render: (t) => toLapTrigger(t),
    },
    {
      title: 'Tid',
      dataIndex: 'total_timer_time',
      key: 'total_timer_time',
      render: (t) => toHHMMSS(t),
    },
    {
      title: 'Sträcka',
      dataIndex: 'total_distance',
      key: 'total_distance',
    },
    {
      title: 'Medelfart',
      dataIndex: 'avg_speed',
      key: 'avg_speed',
      render: (t) => toSpeed(t),
    },
    {
      title: 'Maxfart',
      dataIndex: 'max_speed',
      key: 'max_speed',
      render: (t) => toSpeed(t),
    },
    {
      title: 'Medelkadens',
      dataIndex: 'avg_cadence',
      render: (t) => t * 2,
    },
    {
      title: 'Maxkadens',
      dataIndex: 'max_cadence',
      render: (t) => t * 2,
    },
    {
      title: 'Medelpuls',
      dataIndex: 'avg_heart_rate',
    },
    {
      title: 'Maxpuls',
      dataIndex: 'max_heart_rate',
    },
  ];
  return (
    <Table columns={columns} dataSource={laps} rowKey="timestamp" />
  );
}
LapsTable.propTypes = {
  laps: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

function EventsTable(props) {
  const { events } = props;
  const columns = [
    {
      title: 'Sluttid',
      dataIndex: 'timestamp',
      render: (t) => toDateTime(t),
    },
    {
      title: 'event',
      dataIndex: 'event',
      render: (e) => toEvent(e),
    },
    {
      title: 'event_group',
      dataIndex: 'event_group',
    },
    {
      title: 'event_type',
      dataIndex: 'event_type',
      render: (e) => toEventType(e),
    },
    {
      title: 'data',
      dataIndex: 'data',
    },
  ];
  return (
    <Table columns={columns} dataSource={events} rowKey={(record) => `${record.timestamp}_${record.event}`} />
  );
}
EventsTable.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

function ShowFitfile(props) {
  const { fitfile } = props;
  const polyline = fitfile.records.flatMap((p) => (
    p.position_lat === undefined ? [] : [[p.position_lat, p.position_long]]
  ));
  // Remove? const date = new Date(fitfile.activities[0].timestamp * 1000).toISOString();
  return (
    <div>
      <Map
        center={polyline[0]}
        zoom={13}
        scrollWheelZoom={false}
      >
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
    </div>
  );
}
ShowFitfile.propTypes = {
  fitfile: PropTypes.shape().isRequired,
};

function Rawfile(props) {
  const { rawfile } = props;
  return (
    <div>
      {rawfile.orig_filename}
      <br />
      {rawfile.content_type}
      <br />
      {rawfile.size}
      <ShowFitfile fitfile={rawfile.fitfile} />
    </div>
  );
}
Rawfile.propTypes = {
  rawfile: PropTypes.shape().isRequired,
};

export { Rawfile, toDateTime };
