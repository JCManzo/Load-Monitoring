from flask import Flask, jsonify, render_template
from flask_cors import CORS, cross_origin
import os
import datetime

# Create application instance.
app = Flask(__name__, static_folder="static", static_url_path='', template_folder="static/")

app.config.update(
    SECRET_KEY='DATADOG_LOAD_MONITOR',
    DEBUG=True
)

# Enable cross origin domain requests
CORS(app)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/api/load", methods=["GET", "POST"])
# Prevents unnecessary preflight OPTIONS request.
@cross_origin(max_age=datetime.timedelta(hours=1))
def load():
    # Grabs load average (1min) and creates a unix timestamp in ms.
    curr_time = datetime.datetime.now().replace(microsecond=0).timestamp() * 1000
    response = {
        'load': {
            'timestamp': curr_time,
            'loadavg': os.getloadavg()[0]
        },
        'dateFrom': (datetime.datetime.now() - datetime.timedelta(minutes=10)).replace(microsecond=0).timestamp() * 1000,
        'dateTo': curr_time
    }
    return jsonify(response)


if __name__ == '__main__':
    app.run()
