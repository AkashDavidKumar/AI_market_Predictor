from flask import Blueprint, jsonify
from database.db_connection import crops_collection

crop_bp = Blueprint('crop_bp', __name__)

def doc_to_dict(doc):
    doc['id'] = str(doc.pop('_id'))
    return doc

@crop_bp.route('', methods=['GET'])
def get_crops():
    crops = list(crops_collection.find({}))
    if crops:
        return jsonify([doc_to_dict(c) for c in crops]), 200
    return jsonify([]), 200

@crop_bp.route('/suggestions', methods=['GET'])
def get_suggestions():
    crops = list(crops_collection.find({}).sort("profitability", -1).limit(3))
    if crops:
        return jsonify([doc_to_dict(c) for c in crops]), 200
    return jsonify([]), 200
