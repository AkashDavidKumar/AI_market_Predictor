from flask import Blueprint, jsonify
from database.db_connection import crops_collection, markets_collection, prices_collection, alerts_collection

dashboard_bp = Blueprint('dashboard_bp', __name__)

def doc_to_dict(doc):
    doc['id'] = str(doc.pop('_id'))
    return doc

@dashboard_bp.route('', methods=['GET'])
def get_dashboard():
    # 1. Total Crops
    total_crops = crops_collection.count_documents({})
    
    # 2. Active Markets
    active_markets = markets_collection.count_documents({})
    
    # 3. Latest Prices (Top stats in UI)
    latest_prices_records = list(prices_collection.find({}).sort("date", -1).limit(4))
    latest_prices = [doc_to_dict(p) for p in latest_prices_records]
    
    # 4. Crop Suggestions
    crop_suggestions_records = list(crops_collection.find({}).sort("profitability", -1).limit(3))
    crop_suggestions = [doc_to_dict(c) for c in crop_suggestions_records]
    
    # 5. Alerts (mock identity if needed, or unprotected for dashboard demo)
    alerts = list(alerts_collection.find({}).sort("created_at", -1).limit(3))
    alerts_data = [doc_to_dict(a) for a in alerts]
    
    return jsonify({
        "totalCrops": total_crops,
        "activeMarkets": active_markets,
        "latestPrices": latest_prices,
        "cropSuggestions": crop_suggestions,
        "alerts": alerts_data
    }), 200
