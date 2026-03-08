from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.alert_model import PriceAlert
from database.db_connection import db

alert_bp = Blueprint('alert_bp', __name__)

@alert_bp.route('/create', methods=['POST'])
@jwt_required()
def create_alert():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get('crop_name') or not data.get('target_price'):
        return jsonify({"error": "Missing crop_name or target_price"}), 400
        
    new_alert = PriceAlert(
        user_id=user_id,
        crop_name=data['crop_name'],
        target_price=float(data['target_price'])
    )
    db.session.add(new_alert)
    db.session.commit()
    return jsonify({"message": "Alert created successfully", "alert_id": new_alert.id}), 201

@alert_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_alerts():
    user_id = get_jwt_identity()
    alerts = PriceAlert.query.filter_by(user_id=user_id).all()
    return jsonify({"alerts": [a.to_dict() for a in alerts]}), 200
