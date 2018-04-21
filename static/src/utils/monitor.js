import shortid from 'shortid';

// Utilies to monitor load average usage.

/**
 * Checks to see that loadData contains enough data to satisfy the time interval.
 * @param  {Array[]} loadData  Array of ojects containing load average - Date values.
 * @param  {number}  interval  The time interval at which to check for exceeded load.
 * @return {boolean}           True if time interval reached, false otherwise.
 */
export function loadIntervalReached(loadData, interval) {
  // If the timestamp of the oldest load average plus the time interval (converted to ms)
  // equals the timestamp of the newest load average, we have reached the time interval for
  //  which we check to see if max load has been reached.
  const oldestTimestampWithDelta = loadData[0].timestamp.getTime() + (interval * 60 * 1000);
  const newestTimestamp = loadData[loadData.length - 1].timestamp.getTime();

  return oldestTimestampWithDelta <= newestTimestamp;
}

/**
 * Determines if the load threshold value has been exceeded within the current set of load data.
 *
 * @param  {Array[]} loadData  Array of ojects containing load average - Date values.
 * @param  {number}  threshold The value at which an alert message should be triggered.
 * @param  {number}  interval  The time interval at which to check for exceeded load.
 * @return {Object}            Contains info about the the total load overage over a given
 *                             time interval.
 */
export function loadExceedsThreshold(loadData, threshold, interval) {
  const loadTotal = loadData.reduce((acc, curr) => acc + curr.loadavg, 0);
  const loadAvgTotal = loadTotal / loadData.length;

  // Newest load avg data point will be last element in array.
  const mostRecentLoad = loadData[loadData.length - 1];

  // Create the initial load monitoring state.
  let loadState = {
    interval,
    id: shortid.generate(),
    load: loadAvgTotal,
    time: mostRecentLoad.timestamp.toLocaleString(),
    thresholdReached: false
  };

  if (loadAvgTotal > threshold) {
    // Load average threshold over given time interval has been reached.
    loadState = Object.assign({}, loadState, {
      thresholdReached: true
    });
  }

  return loadState;
}

/**
 * Monitor the load average for a given threshold value over a given time interval.
 *
 * @param  {Array[]} loadData  Array of ojects containing load average - Date values.
 * @param  {number}  threshold The value at which an alert message should be triggered.
 * @param  {number}  interval  The time interval at which to check for exceeded load.
 * @return {mixed}             Object containing high load average that exceeded threshold,
 *                             or false if time interval has not yet been reached.
 */
export function monitorHighLoad(loadData, threshold, interval) {
  if (!loadData.length) {
    // No prior load interval history.
    return false;
  }

  if (loadIntervalReached(loadData, interval)) {
    // Load inerval has been reached. Determine if total load average over this interval
    // has exceeded the threshold.
    const loadIntervalState = loadExceedsThreshold(loadData, threshold, interval);

    return loadIntervalState;
  }

  // Interval not reached yet.
  return false;
}
