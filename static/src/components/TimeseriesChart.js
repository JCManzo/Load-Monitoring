import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisBottom, axisLeft, tickFormat } from 'd3-axis';
import { select, selectAll } from 'd3-selection';
import { line as d3Line } from 'd3-shape';
import { timeFormat } from 'd3-time-format';
import { timeMinute } from 'd3-time';
import { transition, duration } from 'd3-transition';
import { easeLinear } from 'd3-ease';

import getSysLoad from '../utils/http_funcs';
import { monitorHighLoad } from '../utils/monitor';
import './TimeseriesChart.scss';

class TimeseriesChart extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.loadInterval !== nextProps.monitorInterval) {
      // Time interval has changed so discard our current interval's data.
      return Object.assign({}, prevState, {
        loadInterval: nextProps.monitorInterval,
        loadIntervalData: []
      });
    }

    // Not updating state since interval has not changed.
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      loadHistoryData: [],
      loadIntervalData: [],
      loadInterval: 2,
      loadFrom: null,
      loadTo: null,
      currentLoadAvg: 0
    };
  }

  componentDidMount() {
    // Query for system load when component first mounts then every 3 seconds thereafter.
    this.initChart();
    this.timerID = setInterval(
      () => {
        this.getSystemLoad();
      },
      10000
    );
    this.getSystemLoad();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  componentWillUnmount() {
    // Clear our the load avg query timer for this component.
    clearInterval(this.timerID);
  }

  getSystemLoad() {
    getSysLoad()
      .then((response) => {
        this.setState({
          // Update chart state.
          loadHistoryData: [...this.state.loadHistoryData, response.load],
          loadIntervalData: [...this.state.loadIntervalData, response.load],
          loadFrom: response.dateFrom,
          loadTo: response.dateTo,
          loadInterval: this.state.loadInterval,
          currentLoadAvg: Number(response.load.loadavg).toFixed(4)
        }, this.loadExceeded);
      })
      .then(() => this.monitorLoad());
  }

  /**
   * Check if load exceeds the load threshold during the requested time interval.
   *
   * @return {void}
   */
  monitorLoad() {
    const loadIntervalData = this.state.loadIntervalData.slice();
    const { loadInterval } = this.state;
    const { monitorThreshold } = this.props;
    const loadIntervalState = monitorHighLoad(loadIntervalData, monitorThreshold, loadInterval);

    // The interval load data should contain at most (interval mins * 60secs) / 10secs data points.
    if (loadIntervalState) {
      // Monitor time interval was reached. Truncate oldest load average element in our
      // load interval dataset so that we always have the most recent interval's data.
      loadIntervalData.shift();
      this.setState({ loadIntervalData });

      // Reset the load data generated during this time interval.
      this.props.onMonitorEvent(loadIntervalState);
    }
  }

  initChart() {
    const margin = {
      top: 20,
      right: 20,
      bottom: 50,
      left: 50
    };

    // Create svg element once, taking margins into account.
    const svg = select(this.node)
      .attr('width', this.props.width)
      .attr('height', this.props.height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Calculate width of elements that will be drawn inside the svg.
    this.innerWidth = this.props.width - margin.left - margin.right;
    this.innerHeight = this.props.height - margin.top - margin.bottom;

    // Intialize x axis.
    this.xScale = scaleTime()
      .domain('')
      .range([0, this.innerWidth]);

    const formatTick = timeFormat('%H:%M');
    this.xAxis = axisBottom(this.xScale)
      .tickFormat(d => formatTick(d))
      .ticks(timeMinute, 2);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.innerHeight})`)
      .call(this.xAxis);

    // Intialize the y axis. Assumes max value always 8. TODO: Update dynamically
    this.yScale = scaleLinear()
      .domain([0, 8])
      .range([this.innerHeight, 0]);

    this.yAxis = axisLeft(this.yScale)
      .ticks(4);

    svg.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis);

    // Draw titles for axes
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'axis-label')
      .attr('transform', `translate(-30, ${this.innerHeight / 2})rotate(-90)`)
      .text('Load Avg');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'axis-label')
      .attr('transform', `translate(${this.innerWidth / 2}, ${this.innerHeight + margin.bottom})`)
      .text('Time');

    // Draw grid lines.
    svg.append('g')
      .attr('class', 'grid')
      .call(axisLeft(this.yScale)
        .tickSize(-this.innerWidth)
        .ticks(4)
        .tickFormat(''));

    // Draw initial path
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.innerWidth)
      .attr('height', this.innerHeight);

    svg.append('g')
      .attr('clip-path', 'url(#clip)')
      .append('path')
      .attr('class', 'line');
  }

  updateChart() {
    if (!this.state.loadHistoryData.length) return null;

    const { loadFrom, loadTo } = this.state;
    const loadHistoryData = this.state.loadHistoryData.slice();

    // Format last element in array
    const lastIndex = loadHistoryData.length - 1;
    loadHistoryData[lastIndex].timestamp = new Date(loadHistoryData[lastIndex].timestamp);
    loadHistoryData[lastIndex].loadavg = +loadHistoryData[lastIndex].loadavg;

    const svg = select(this.node);
    const line = d3Line()
      .x(d => this.xScale(d.timestamp))
      .y(d => this.yScale(d.loadavg));

    // Update x axis's scale
    this.xScale
      .domain([new Date(loadFrom), new Date(loadTo)])
      .range([0, this.innerWidth]);
    this.xAxis.scale(this.xScale);

    // Update line with new data points and translate to the left.
    svg.select('g')
      .select('.line')
      .data([loadHistoryData])
      .attr('d', line);

    svg.selectAll('g.x.axis')
      .transition()
      .duration(500)
      .ease(easeLinear)
      .call(this.xAxis);

    // Our time domain is a ten minutes and we plot a point every 10 seconds,
    // therefore display up 60 data points max. Once we reach this limit,
    // remove the oldest load data point (first element).
    if (loadHistoryData.length > 60) {
      loadHistoryData.shift();
      this.setState({ loadHistoryData });
    }
  }

  render() {
    return (
      <div className="chart-container">
        <h4>{this.props.title}</h4>
        <h5>Current load avg: {this.state.currentLoadAvg}</h5>
        <svg ref={(node) => {this.node = node}} />
      </div>
    );
  }
}


TimeseriesChart.defaultProps = {
  title: 'System Load Avg'
};

TimeseriesChart.propTypes = {
  title: PropTypes.string,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  monitorThreshold: PropTypes.number.isRequired,
  onMonitorEvent: PropTypes.func.isRequired
};

export default TimeseriesChart;
