from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.prediction_service import PredictionService

class PredictionController:
    @staticmethod
    def predict():
        data = request.get_json()
        if not data or not all(k in data for k in ('crop_name', 'market', 'date')):
            return jsonify({"error": "Missing required fields: crop_name, market, date"}), 400
            
        try:
            auth_header = request.headers.get('Authorization', '')
            user_id = None
            if auth_header.startswith('Bearer '):
                 from flask_jwt_extended import verify_jwt_in_request
                 verify_jwt_in_request()
                 user_id = get_jwt_identity()
        except Exception:
            user_id = None
            
        response, status_code = PredictionService.predict_price(
            crop_name=data['crop_name'],
            market=data['market'],
            date_str=data['date'],
            user_id=user_id
        )
        return jsonify(response), status_code
