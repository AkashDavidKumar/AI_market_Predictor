from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db_connection import crops_collection, markets_collection, prices_collection, alerts_collection

dashboard_bp = Blueprint('dashboard_bp', __name__)

def doc_to_dict(doc):
    if doc is None: return None
    d = dict(doc)
    if '_id' in d:
        d['id'] = str(d.pop('_id'))
    return d

@dashboard_bp.route('', methods=['GET'])
@jwt_required()
def get_dashboard():
    user_id = get_jwt_identity()
    
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

    # 4. Comprehensive Crop Suggestions (No limit)
    # We fetch more so the frontend can filter/sort
    crop_suggestions_records = list(crops_collection.find({}).sort("profitability", -1))
    crop_suggestions = []
    
    from services.prediction_service import PredictionService
    predictor = PredictionService()

    for c in crop_suggestions_records:
        d = doc_to_dict(c)
        if d:
            name = d.get('name') or d.get('crop_name') or "Unknown"
            
            # Fetch the actual latest price for this specific crop
            latest_price = prices_collection.find_one({"crop": name}, sort=[("date", -1)])
            
            # Ensure field names match frontend expectations
            d['name'] = name
            d['type'] = d.get('category') or d.get('type') or "crops"
            d['market'] = latest_price.get('market') if latest_price else (d.get('best_market') or "Main Market")
            d['profitability_score'] = d.get('profitability', 0)
            
            # Augment with dynamic prediction data
            try:
                market = d['market']
                from datetime import datetime
                pred = predictor.predict_price(name, market, datetime.now().strftime('%Y-%m-%d'))
                
                # Use real price if available, otherwise use prediction's internal logic
                d['current_price'] = latest_price.get('price') if latest_price else pred[0].get('current_price', 0)
                d['expected_price'] = pred[0].get('predicted_price')
                d['unit'] = pred[0].get('unit') or "₹/kg"
                d['trend'] = pred[0].get('trend') or "stable"
                d['confidence'] = pred[0].get('confidence')
                d['recommendation'] = "SELL" if d['trend'] == "downward" else "HOLD"
            except Exception as e:
                print(f"Prediction failed for {name}: {e}")
                d['current_price'] = latest_price.get('price', 0) if latest_price else 0
                d['expected_price'] = d.get('profitability', 0) * 50
                d['unit'] = "₹/kg"
                d['trend'] = "stable"
                d['recommendation'] = "HOLD"
                
            crop_suggestions.append(d)
    
    # 5. User-specific Alerts
    alerts = list(alerts_collection.find({"user_id": user_id}).sort("created_at", -1))
    alerts_data = [doc_to_dict(a) for a in alerts]
    
    return jsonify({
        "totalCrops": total_crops,
        "activeMarkets": active_markets,
        "latestPrices": latest_prices,
        "bestPrice": best_price,
        "cropSuggestions": crop_suggestions,
        "alerts": alerts_data
    }), 200
