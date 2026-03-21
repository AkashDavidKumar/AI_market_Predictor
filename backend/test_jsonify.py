import sys
import os
from flask import Flask, jsonify

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from routes.dashboard_routes import dashboard_bp
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Register without JWT for testing
@dashboard_bp.route('/test', methods=['GET'])
def get_dashboard_test():
    from database.db_connection import prices_collection
    latest_prices_records = list(prices_collection.find({}).sort("date", -1).limit(4))
    
    if latest_prices_records:
        print(f"DEBUG: Type of date field: {type(latest_prices_records[0].get('date'))}")
    
    try:
        response_data = jsonify({"test": latest_prices_records})
        return response_data
    except Exception as e:
        print(f"DEBUG: Jsonify failed: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    with app.test_client() as client:
        response = client.get('/api/dashboard/test')
        print(f"Status: {response.status_code}")
        print(f"Output: {response.data.decode('utf-8')[:200]}")
