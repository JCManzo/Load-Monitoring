import React, { Component } from 'react';

import MonitorChart from './MonitorChart';
import AlertList from './AlertList';

import './Dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alertHistory: [],
      alertInterval: 2,
      alertThreshold: 2
    };
  }

  handleOnMonitorChange(event) {
    const { alertHistory } = this.state;

    // Most recent alert is stored in first index.
    const lastAlert = alertHistory[0];

    // Display new high usage message if total load avg over last 2 minutes has been
    // exceeded and only if the last most recent alert isn't also a high usage message.
    const alertHighLoad = event.thresholdReached &&
                          (!lastAlert || !lastAlert.thresholdReached);

    // Display recovery message if total load avg over last 2 minutes is below the
    // threshold and if the last most recent message isn't also a recovery message.
    // The last message must be a high usage alert message.
    const alertRecovery = !event.thresholdReached
                          && (lastAlert && lastAlert.thresholdReached);

    if (alertHighLoad || alertRecovery) {
      // Update the alert history with new alert or recovery message.
      this.setState({
        alertHistory: [event, ...this.state.alertHistory]
      });
    }
  }

  handleMonitorSettingsChange(event) {
    if (event.type === 'interval') {
      this.setState({
        alertInterval: event.value
      });

      // Reset alert history once the time interval has changed since our old
      // interval data is no longer valid.
      this.setState({
        alertHistory: []
      });

    } else if (event.type === 'threshold') {
      this.setState({
        alertThreshold: event.value
      });
    }
  }

  render() {
    return (
      <div className="dashboard">
        <MonitorChart
          onMonitorSettingsChange={event => this.handleMonitorSettingsChange(event)}
          onMonitorEvent={event => this.handleOnMonitorChange(event)}
        />
        <AlertList
          title={`Monitoring for high load over a ${this.state.alertInterval}-minute interval`}
          alerts={this.state.alertHistory}
        />
      </div>
    );
  }
}

export default Dashboard;
