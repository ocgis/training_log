import moment from 'moment';

const toYYYYMMDD = (isoDateStr) => moment(isoDateStr).format('YYYY-MM-DD');

const toHHMMSS = (seconds) => {
  const hour = Math.floor(seconds / 60 / 60).toString();
  const min = (Math.floor(seconds / 60) % 60).toString().padStart(2, '0');
  const sec = (Math.floor(seconds) % 60).toString().padStart(2, '0');
  return `${hour}:${min}:${sec}`;
};

const toS = (hhmmss) => {
  if (hhmmss == null) {
    return null;
  }

  const parts = hhmmss.split(':');

  switch (parts.length) {
    case 0:
      return null;

    case 1:
      return parseInt(parts[0], 10) * 60;

    case 2:
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);

    case 3:
      return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);

    default:
      console.log(`Can't handle time ${hhmmss}!`);
      return null;
  }
};

const toMSS = (seconds) => {
  const min = Math.floor(seconds / 60).toString();
  const sec = (Math.floor(seconds) % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
};

const toSpeed = (mPerS) => {
  const perKm = toMSS(1000.0 / mPerS);
  const kmPerH = (mPerS * 3.6).toFixed(3);
  return `${perKm} /km (${kmPerH} km/h)`;
};

const distanceDurationToSpeed = (distanceM, durationS) => {
  if ((distanceM == null) || (distanceM === 0)
      || (durationS == null) || (durationS === 0)) {
    return '';
  }
  return toSpeed(distanceM / durationS);
};

const toKm = (distanceM) => {
  if (distanceM === null) {
    return '';
  }

  return `${(distanceM / 1000).toFixed(3)} km`;
};

export {
  distanceDurationToSpeed, toYYYYMMDD, toHHMMSS, toKm, toS, toSpeed,
};
