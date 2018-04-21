# Load Monitoring Web App

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

