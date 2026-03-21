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
@dashboard_bp.route('/test_v2', methods=['GET'])
def get_dashboard_test_v2():
    from database.db_connection import crops_collection
    
    def doc_to_dict(doc):
        if doc is None: return None
        d = dict(doc)
        if '_id' in d:
            d['id'] = str(d.pop('_id'))
        return d

    crop_suggestions_records = list(crops_collection.find({}).sort("profitability", -1).limit(3))
    crop_suggestions = []
    for c in crop_suggestions_records:
        d = doc_to_dict(c)
        if d:
            d['name'] = d.get('name') or d.get('crop_name') or "Unknown"
            crop_suggestions.append(d)
    
    return jsonify({"cropSuggestions": crop_suggestions})

app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

if __name__ == "__main__":
    with app.test_client() as client:
        response = client.get('/api/dashboard/test_v2')
        print(f"Data: {response.data.decode('utf-8')[:500]}")
