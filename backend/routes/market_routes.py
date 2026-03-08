from flask import Blueprint, request, jsonify
from services.market_service import MarketService

market_bp = Blueprint('market_bp', __name__)

@market_bp.route('', methods=['GET'])
def get_markets():
    response, status = MarketService.get_all_markets()
    return jsonify(response), status

@market_bp.route('/recommend', methods=['GET'])
def recommend():
    crop = request.args.get('crop')
    date_str = request.args.get('date')
    if not crop or not date_str:
        return jsonify({"error": "Missing crop or date parameter"}), 400
        
    response, status = MarketService.recommend_market(crop, date_str)
    return jsonify(response), status
