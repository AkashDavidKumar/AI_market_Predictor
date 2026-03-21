from flask import Blueprint
from controllers.prediction_controller import PredictionController

prediction_bp = Blueprint('prediction_bp', __name__)

from flask import request, jsonify
prediction_bp.route('/predict-price', methods=['POST'])(PredictionController.predict)

@prediction_bp.route('/market-trends', methods=['GET'])
def get_market_trends():
    crop = request.args.get('crop', 'Wheat')
    market = request.args.get('market', 'Delhi')
    
    from database.db_connection import prices_collection
    # Ensure we get some data even if small
    records = list(prices_collection.find({"crop_name": crop, "market": market}).sort("date", 1).limit(7))
    
    trend_data = []
    for r in records:
        trend_data.append({
            "date": r["date"].strftime('%Y-%m-%d') if hasattr(r["date"], 'strftime') else r["date"],
            "price": r["price"]
        })
        
    return jsonify(trend_data), 200
