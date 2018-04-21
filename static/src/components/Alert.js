import React from 'react';
import PropTypes from 'prop-types';

/**
 * A single alert containing either a highload or recovery message.
 */
const Alert = (props) => {
  const messageType = () => {
    const { load, time, thresholdReached } = props;

    if (thresholdReached) {
      // Show threshold reached alert.
      return (
        <span className="alert-message alert-highload">
          High load generated an alert - load &asymp; {Number(load).toFixed(4)}, triggered at {time}
        </span>
      );
    }

    // Show recovery alert.
    return (
      <span className="alert-message alert-recovery">
        Recovered - load &asymp; {Number(load).toFixed(4)}, triggered at {time}
      </span>
    );
  };

  return (
    <li>
      {messageType()}
    </li>
  );
};

Alert.propTypes = {
  load: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
  thresholdReached: PropTypes.bool.isRequired
};

export default Alert;
