import datetime
from flask import Flask, jsonify

app = Flask(__name__)

with app.app_context():
    try:
        data = {"d": datetime.datetime.now()}
        print(f"DEBUG: Data to jsonify: {data}")
        json_data = jsonify(data).get_data(as_text=True)
        print(f"DEBUG: Result: {json_data}")
    except TypeError as e:
        print(f"DEBUG: TypeError: {e}")
    except Exception as e:
        print(f"DEBUG: Exception: {e}")
