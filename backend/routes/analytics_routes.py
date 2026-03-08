from flask import Blueprint, request, jsonify
from models.price_model import MarketPrice

analytics_bp = Blueprint('analytics_bp', __name__)

@analytics_bp.route('/market-trends', methods=['GET'])
def market_trends():
    crop = request.args.get('crop')
    if not crop:
        return jsonify({"error": "Missing crop parameter"}), 400
        
    records = MarketPrice.query.filter_by(crop_name=crop).order_by(MarketPrice.date).limit(50).all()
    dates = [r.date.isoformat() for r in records]
    prices = [r.price for r in records]
    
    return jsonify({
        "crop": crop,
        "dates": dates,
        "prices": prices
    }), 200
