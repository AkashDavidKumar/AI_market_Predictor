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
    # Mock user_id since we skipped JWT
    user_id = "test_user"
    
    from database.db_connection import crops_collection, markets_collection, prices_collection, alerts_collection
    
    def doc_to_dict(doc):
        if doc is None: return None
        d = dict(doc)
        if '_id' in d:
            d['id'] = str(d.pop('_id'))
        return d

    # 1. Total Crops
    total_crops = crops_collection.count_documents({})
    
    # 2. Active Markets
    active_markets = markets_collection.count_documents({})
    
    # 3. Latest Prices (Top stats in UI)
    latest_prices_records = list(prices_collection.find({}).sort("date", -1).limit(4))
    latest_prices = [doc_to_dict(p) for p in latest_prices_records]
    
    # 3b. Best Price for Stat Card
    best_price_doc = latest_prices_records[0] if latest_prices_records else None
    best_price = doc_to_dict(best_price_doc.copy()) if best_price_doc else None

    # 4. Crop Suggestions
    crop_suggestions_records = list(crops_collection.find({}).sort("profitability", -1).limit(3))
    crop_suggestions = [doc_to_dict(c) for c in crop_suggestions_records]
    
    # 5. User-specific Alerts
    # Use empty list or find all if user_id is ignored
    alerts = list(alerts_collection.find({}).sort("created_at", -1).limit(3))
    alerts_data = [doc_to_dict(a) for a in alerts]
    
    return jsonify({
        "totalCrops": total_crops,
        "activeMarkets": active_markets,
        "latestPrices": latest_prices,
        "bestPrice": best_price,
        "cropSuggestions": crop_suggestions,
        "alerts": alerts_data
    })

app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

if __name__ == "__main__":
    with app.test_client() as client:
        response = client.get('/api/dashboard/test')
        print(f"Status: {response.status_code}")
        print(f"Data: {response.data.decode('utf-8')}")
