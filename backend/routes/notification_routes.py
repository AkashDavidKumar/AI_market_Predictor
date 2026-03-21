from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db_connection import notifications_collection
from bson import ObjectId

notification_bp = Blueprint('notification_bp', __name__)

def doc_to_dict(doc):
    if doc is None: return None
    d = dict(doc)
    if '_id' in d:
        d['id'] = str(d.pop('_id'))
    return d

@notification_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    
    # Fetch notifications for the user, sorted by time (latest first)
    # We assume 'time_val' or 'created_at' exists for sorting
    # For now, we'll just fetch all and return
    notifications_cursor = notifications_collection.find({"user_id": user_id}).sort("created_at", -1).limit(20)
    notifications = [doc_to_dict(n) for n in notifications_cursor]
    
    return jsonify(notifications), 200
