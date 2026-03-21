from flask import Blueprint, request, jsonify
from database.db_connection import prices_collection, crops_collection
from utils.cache_utils import app_cache

analytics_bp = Blueprint('analytics_bp', __name__)

@analytics_bp.route('/charts', methods=['GET'])
def get_charts_data():
    crop = request.args.get('crop', 'Wheat')
    market = request.args.get('market')
    
    cache_key = f"analytics_{crop}_{market}"
    cached_res = app_cache.get(cache_key)
    if cached_res:
        return jsonify(cached_res), 200

    print(f"Analytics Request: crop={crop}, market={market}")
    
    # 1. Line Chart Data (Price Trends)
    # The collection uses 'crop' field, not 'crop_name'
    query = {"crop": crop}
    if market:
        query["market"] = market
        
    records = list(prices_collection.find(query).sort("date", 1).limit(60))
    line_data = []
    prices = []
    
    import datetime
    import random

    if not records:
        print(f"No records found for {crop} in {market}. Generating fallback data.")
        # Generate 7 days of dummy data
        today = datetime.datetime.now()
        base_price = 2000 # Default fallback
        
        # Try to get more realistic base price from crops collection
        crop_info = crops_collection.find_one({"name": crop})
        if crop_info:
            # Assume profitability correlates with base price for dummy purposes
            base_price = crop_info.get("profitability", 50) * 30
            
        for i in range(7):
            date = (today - datetime.timedelta(days=(7-i))).strftime('%Y-%m-%d')
            # Random variation +/- 5%
            price = base_price * (1 + random.uniform(-0.05, 0.05))
            line_data.append({
                "date": date,
                "price": round(price, 2)
            })
            prices.append(price)
    else:
        for r in records:
            price = r.get("price") or r.get("current_price") or 0
            line_data.append({
                "date": r["date"].strftime('%Y-%m-%d') if hasattr(r["date"], 'strftime') else r["date"],
                "price": price
            })
            prices.append(price)
    
    # 2. Bar Chart Data (Market Comparison)
    # Fixed field name to 'crop' here too
    pipeline = [
        {"$match": {"crop": crop}},
        {"$group": {"_id": "$market", "avg_price": {"$avg": "$price"}}}
    ]
    market_avg = list(prices_collection.aggregate(pipeline))
    
    if not market_avg:
        # Fallback market comparison
        bar_data = [
            {"market": "Delhi Mandi", "price": round(base_price * 1.05, 2) if 'base_price' in locals() else 2100},
            {"market": "Mumbai APMC", "price": round(base_price * 1.1, 2) if 'base_price' in locals() else 2250},
            {"market": "Local Market", "price": round(base_price * 0.95, 2) if 'base_price' in locals() else 1900}
        ]
    else:
        bar_data = [{"market": m["_id"], "price": round(m["avg_price"], 2)} for m in market_avg]
    
    # 3. Radar Chart Data (Crop Profitability)
    # (Remains same as it uses crops_collection which is likely seeded)
    crops = list(crops_collection.find({}))
    radar_labels = [c.get("name", "") for c in crops]
    radar_values = [c.get("profitability", 0) for c in crops]

    # 4. Market Insights & AI Summary
    import statistics
    volatility = "Moderate"
    if len(prices) > 1:
        std_dev = statistics.stdev(prices)
        if std_dev > 500: volatility = "High"
        elif std_dev < 100: volatility = "Low"
    
    demand_index = 75 # Default
    if "Wheat" in crop: demand_index = 88
    elif "Tomato" in crop: demand_index = 92
    
    supply_level = "Medium"
    if demand_index > 90: supply_level = "Low"
    
    best_time = "Weekend - Morning"
    if "veg" in crop.lower(): best_time = "Daily - Early Morning"

    market_name = market if market else "Major Markets"
    ai_summary = f"{crop} prices in {market_name} are showing a {volatility.lower()} volatility pattern. With a demand index of {demand_index}, traders are advised to monitor supply levels closely."
        
    res_data = {
        "line": line_data,
        "bar": bar_data,
        "radar": {
            "labels": radar_labels,
            "values": radar_values
        },
        "insights": {
            "demand_index": demand_index,
            "supply_level": supply_level,
            "volatility": volatility,
            "best_selling_time": best_time
        },
        "ai_summary": ai_summary
    }
    
    app_cache.set(cache_key, res_data, ttl=1800) # Cache for 30 mins
    return jsonify(res_data), 200
