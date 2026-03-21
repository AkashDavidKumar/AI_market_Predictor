from flask import Blueprint, jsonify
from database.db_connection import crops_collection, prices_collection

crop_bp = Blueprint('crop_bp', __name__)

def doc_to_dict(doc):
    if doc is None: return None
    d = dict(doc)
    if '_id' in d:
        d['id'] = str(d.pop('_id'))
    return d

@crop_bp.route('/assets', methods=['GET'])
def get_assets():
    # Primary crops in the system
    primary_crops = list(crops_collection.find({}))
    crop_list = [c.get('name') or c.get('crop_name') for c in primary_crops]
    
    # Categorized list as requested
    return jsonify({
        "crops": list(set(crop_list + ["Wheat", "Rice", "Maize", "Cotton", "Soybean"])),
        "vegetables": ["Tomato", "Potato", "Onion", "Carrot", "Brinjal", "Cabbage"],
        "fruits": ["Apple", "Banana", "Mango", "Orange", "Grapes", "Papaya"],
        "seeds": ["Groundnut Seed", "Sunflower Seed", "Mustard Seed", "Sesame Seed"]
    }), 200

@crop_bp.route('', methods=['GET'])
def get_crops():
    return get_assets()

@crop_bp.route('/suggestions', methods=['GET'])
def get_suggestions():
    # Fetch all assets
    assets = list(crops_collection.find({}))
    results = []
    
    from services.prediction_service import PredictionService
    import datetime
    today = datetime.datetime.now().strftime('%Y-%m-%d')
    predictor = PredictionService()

    for asset in assets:
        d = doc_to_dict(asset)
        name = d.get('name') or d.get('crop_name')
        
        # 1. Fetch latest physical price
        latest_price_doc = prices_collection.find_one({"crop": name}, sort=[("date", -1)])
        
        # 2. Get AI prediction
        market = latest_price_doc.get("market") if latest_price_doc else (d.get("best_market") or "Delhi")
        prediction, status = predictor.predict_price(name, market, today)
        
        if status == 200:
            expected_price = prediction.get("predicted_price")
            unit = prediction.get("unit")
            trend = prediction.get("trend")
            confidence = prediction.get("confidence")
        else:
            # Fallback
            expected_price = d.get("profitability", 50) * 40
            unit = "₹/Unit"
            trend = "stable"
            confidence = 80

        # 3. Calculate/Adjust Profitability Score
        score = d.get("profitability", 75)
        # Dynamic label
        if score > 85: label = "Highly Recommended"
        elif score > 60: label = "Moderate"
        else: label = "Low Profit"

        results.append({
            "name": name,
            "type": d.get("category", "crops"),
            "market": market,
            "expected_price": expected_price,
            "unit": unit,
            "profitability_score": score,
            "trend": trend,
            "recommendation_label": label,
            "confidence": confidence
        })
    
    # Sort by profit score by default
    results.sort(key=lambda x: x['profitability_score'], reverse=True)
    return jsonify(results), 200

@crop_bp.route('/details/<crop_name>', methods=['GET'])
def get_crop_details(crop_name):
    # 1. Base Crop Info
    crop = crops_collection.find_one({"name": crop_name})
    if not crop:
        return jsonify({"error": "Crop not found"}), 404
        
    # 2. Historical Prices (Last 7 days)
    # Note: In a real app, we'd filter by crop_name, but for this demo 
    # we'll fetch recent aggregate prices if crop-specific ones are sparse.
    historical_records = list(prices_collection.find({"crop": crop_name}).sort("date", -1).limit(7))
    if not historical_records:
        # Fallback to general recent prices for demo if none for this crop
        historical_records = list(prices_collection.find({}).sort("date", -1).limit(7))
        
    historical_prices = [doc_to_dict(p) for p in historical_records]
    
    # 3. Market Recommendation (using existing service logic)
    # For now, we'll return a static market or use MarketService if needed
    from services.market_service import MarketService
    import datetime
    today = datetime.datetime.now().strftime('%Y-%m-%d')
    market_info, _ = MarketService.recommend_market(crop_name, today)

    return jsonify({
        "crop": doc_to_dict(crop),
        "historical_prices": historical_prices,
        "recommendation": market_info
    }), 200
