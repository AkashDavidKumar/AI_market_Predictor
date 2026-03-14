from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db_connection import alerts_collection
import datetime

alert_bp = Blueprint('alert_bp', __name__)

def doc_to_dict(doc):
    if doc is None: return None
    d = dict(doc)
    if '_id' in d:
        d['id'] = str(d.pop('_id'))
    return d

@alert_bp.route('/create', methods=['POST'])
@jwt_required()
def create_alert():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get('crop_name') or not data.get('target_price'):
        return jsonify({"error": "Missing crop_name or target_price"}), 400
        
    new_alert = {
        "user_id": user_id,
        "crop_name": data['crop_name'],
        "target_price": float(data['target_price']),
        "is_active": True,
        "created_at": datetime.datetime.utcnow()
    }
    
    result = alerts_collection.insert_one(new_alert)
    return jsonify({"message": "Alert created successfully", "alert_id": str(result.inserted_id)}), 201

@alert_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_alerts():
    user_id = get_jwt_identity()
    alerts = list(alerts_collection.find({"user_id": user_id}))
    return jsonify({"alerts": [doc_to_dict(a) for a in alerts]}), 200
