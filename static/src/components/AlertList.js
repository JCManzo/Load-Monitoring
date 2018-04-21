import React from 'react';
import PropTypes from 'prop-types';

import Alert from './Alert';
import './AlertList.scss';

const AlertList = (props) => {
  // Create Alert components for each alert object.
  const alertItems = props.alerts.map((alert) => {
    return (
      <Alert
        key={alert.id}
        thresholdReached={alert.thresholdReached}
        load={alert.load}
        time={alert.time}
      />
    );
  });

  return (
    <div className="alert-list">
      <h4>{props.title}</h4>
      { alertItems.length ?
        <ul>
          {alertItems}
        </ul>
        :
        null
      }
    </div>
  );
};

AlertList.defaultProps = {
  title: 'Monitoring for high load over a 2-minute interval'
};

AlertList.propTypes = {
  title: PropTypes.string,
  alerts: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default AlertList;
