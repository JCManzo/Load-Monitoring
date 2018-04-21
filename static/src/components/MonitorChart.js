import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeseriesChart from './TimeseriesChart';

import './MonitorChart.scss';

class MonitorChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      threshold: 1,
      interval: 2
    };
  }

  handleOnChange(event, type) {
    const newState = {};
    const value = (event.target.value) ? parseInt(event.target.value, 10) : 1;
    newState[type] = value;

    // Validate fields after field states has been updated.
    this.setState(newState, () => {
      this.props.onMonitorSettingsChange({
        type,
        value
      });
    });
  }

  render() {
    return (
      <div className="monitor-chart">
        <div className="monitor-controls">
          Trigger alert when load average exceeds
          <input
            min={1}
            max={8}
            type="number"
            placeholder="Load threshold"
            value={this.state.threshold}
            onChange={e => this.handleOnChange(e, 'threshold')}
          />
           during the last
          <select
            value={this.state.interval}
            onChange={e => this.handleOnChange(e, 'interval')}
          >
            <option value="1">1 minute</option>
            <option value="2">2 minutes</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
          </select>
        </div>
        <TimeseriesChart
          title="System Load Avg (1min)"
          width="700"
          height="300"
          monitorThreshold={this.state.threshold}
          monitorInterval={this.state.interval}
          {...this.props}
        />
      </div>
    );
  }
}

TimeseriesChart.propTypes = {
  onMonitorSettingsChange: PropTypes.func.isRequired
};

export default MonitorChart;
