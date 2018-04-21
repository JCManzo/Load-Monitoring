import { monitorHighLoad } from '../src/utils/monitor';

const assert = require('assert');

const twoMinLoadData = [
  { loadavg: 1.46826171875, timestamp: new Date('2018-04-01T03:18:07.000Z') },
  { loadavg: 1.55615234375, timestamp: new Date('2018-04-01T03:18:17.000Z') },
  { loadavg: 1.5439453125, timestamp: new Date('2018-04-01T03:18:27.000Z') },
  { loadavg: 1.4599609375, timestamp: new Date('2018-04-01T03:18:37.000Z') },
  { loadavg: 1.388671875, timestamp: new Date('2018-04-01T03:18:47.000Z') },
  { loadavg: 1.24853515625, timestamp: new Date('2018-04-01T03:18:57.000Z') },
  { loadavg: 1.36376953125, timestamp: new Date('2018-04-01T03:19:07.000Z') },
  { loadavg: 1.3876953125, timestamp: new Date('2018-04-01T03:19:17.000Z') },
  { loadavg: 1.47509765625, timestamp: new Date('2018-04-01T03:19:27.000Z') },
  { loadavg: 1.5556640625, timestamp: new Date('2018-04-01T03:19:37.000Z') },
  { loadavg: 1.62353515625, timestamp: new Date('2018-04-01T03:19:47.000Z') },
  { loadavg: 1.6005859375, timestamp: new Date('2018-04-01T03:19:57.000Z') },
  { loadavg: 1.58154296875, timestamp: new Date('2018-04-01T03:20:07.000Z') }
];

const twoMinVariableLoadData = [
  { loadavg: 2.54736328125, timestamp: new Date('Apr 02 2018 13:16:31 GMT-0400') },
  { loadavg: 2.462890625, timestamp: new Date('Apr 02 2018 13:16:41 GMT-0400') },
  { loadavg: 2.1640625, timestamp: new Date('Apr 02 2018 13:16:51 GMT-0400') },
  { loadavg: 1.98486328125, timestamp: new Date('Apr 02 2018 13:17:01 GMT-0400') },
  { loadavg: 1.8330078125, timestamp: new Date('Apr 02 2018 13:17:11 GMT-0400') },
  { loadavg: 1.7783203125, timestamp: new Date('Apr 02 2018 13:17:21 GMT-0400') },
  { loadavg: 1.7958984375, timestamp: new Date('Apr 02 2018 13:17:31 GMT-0400') },
  { loadavg: 1.74658203125, timestamp: new Date('Apr 02 2018 13:17:41 GMT-0400') },
  { loadavg: 1.705078125, timestamp: new Date('Apr 02 2018 13:17:51 GMT-0400') },
  { loadavg: 1.830078125, timestamp: new Date('Apr 02 2018 13:18:01 GMT-0400') },
  { loadavg: 1.775390625, timestamp: new Date('Apr 02 2018 13:18:11 GMT-0400') }
];

describe('Monitor for high load', () => {
  // Test if load threshold is never reached within 2 minutes, false is returned.
  it('should test if load average over last 2 minutes exceeds 1, an object is returned.', () => {
    const response = monitorHighLoad(twoMinLoadData, 1, 2);
    assert.equal(response.thresholdReached, true);
  });

  it('should test if load threshold is never reached within 2 minutes, false is returned.', () => {
    const response = monitorHighLoad(twoMinLoadData, 2, 2);
    assert.equal(response.thresholdReached, false);
  });

  it('should test if load averge over last 1 minute exceeds 1, an object is returned.', () => {
    const response = monitorHighLoad(twoMinVariableLoadData, 1, 1);
    assert.equal(response.thresholdReached, true);
  });

  it('should test if load threshold is never reached within 1 minute, false is returned.', () => {
    const response = monitorHighLoad(twoMinVariableLoadData, 2, 1);
    assert.equal(response.thresholdReached, false);
  });
});
