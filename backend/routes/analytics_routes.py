from flask import Blueprint, request, jsonify
from database.db_connection import prices_collection, crops_collection

analytics_bp = Blueprint('analytics_bp', __name__)

@analytics_bp.route('/charts', methods=['GET'])
def get_charts_data():
    crop = request.args.get('crop', 'Wheat')
    
    # 1. Line Chart Data (Price Trends)
    records = list(prices_collection.find({"crop_name": crop}).sort("date", 1).limit(50))
    # We assume 'date' is stored as a string or datetime. Format as string for output.
    dates = [r["date"].strftime('%Y-%m-%d') if hasattr(r["date"], 'strftime') else r["date"] for r in records]
    prices = [r["price"] for r in records]
    
    # If no data, provide fallback for demo UI
    if not dates:
        dates = ['2023-01', '2023-02', '2023-03']
        prices = [2100, 2200, 2150]

    # 2. Bar Chart Data (Market Comparison)
    pipeline = [
        {"$group": {"_id": "$market", "avg_price": {"$avg": "$price"}}}
    ]
    market_avg = list(prices_collection.aggregate(pipeline))
    
    bar_labels = [m["_id"] for m in market_avg]
    bar_data = [round(m["avg_price"], 2) for m in market_avg]
    
    if not bar_labels:
        bar_labels = ['Nagpur', 'Indore']
        bar_data = [2400, 2300]
        
    # 3. Radar Chart Data (Crop Profitability)
    crops = list(crops_collection.find({}))
    radar_labels = [c.get("name", "") for c in crops]
    radar_data = [c.get("profitability", 0) for c in crops]
    
    if not radar_labels:
        radar_labels = ['Wheat', 'Rice']
        radar_data = [70, 65]
        
    return jsonify({
        "line": {
            "labels": dates,
            "data": prices
        },
        "bar": {
            "labels": bar_labels,
            "data": bar_data
        },
        "radar": {
            "labels": radar_labels,
            "data": radar_data
        }
    }), 200
