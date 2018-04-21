# DataDog Load Monitoring App

Front-end built using:

* React.js
* D3.js
* ES6 with Babel
* Webpack
* SASS
* Mocha for testing

The Back-end built using:

* Python3 (version 3.6.4)
* Flask microframework for routing and polling
* Flask-CORS for cross-origin domain

# Installation
* Make sure you have python3 and pip3 installed.
* Create a virtual environment.
* To install project requirements run:
  `pip3 install -r requirements.txt`
* The project includes a production ready React bundle.js in `static/dist` so no need to run `yarn`
* If you do want to re-build the react front-end yourself, run `yarn`

# Usage
1. Run `python3 app.py` to start the server.
2. Navigate to `http://127.0.0.1:5000` on your browser.
3. System load average will start plotting to a time series chart in 10 second intervals.

# Test
* The project uses Mocha for unit testing the alert logic.
* To test run `yarn test`

# Potential Improvements to Application
* Currently only the 1 min load average is plotted to the chart. An improvement can be made to display the 1, 5 and 15 minute load averages as:
    * Multiple lines on the same time series chart.
    * A dropdown selection and display only that one.
    * Allow for multiple time series charts
* If I had more time, I would have liked to have made the chart more interactive by:
    * Having the ability to maximize time series chart or allowing zoom-in.
    * Showing data point circles when hovering over the chart.
* To improve the monitoring aspect, I would have added:
    * The ability to email a user when a load avg threshold is reached.
    * More control over the load threshold (i.e. below a certain value)
* More unit tests could certainly improve the application to test any edge cases.
* Stored load interval data in server or with localstorage so user has some history when application is reloaded.
* Use sockets to have the server emit events when it generates (loadavg, timestamp) pairs instead of having the client query every 10 seconds.
    * This gives the benifit of having a single TCP connection between server and client instead of making a new HTTP GET request for every poll request.
