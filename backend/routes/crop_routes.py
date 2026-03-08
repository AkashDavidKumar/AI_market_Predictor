from flask import Blueprint, jsonify
from models.crop_model import Crop

crop_bp = Blueprint('crop_bp', __name__)

@crop_bp.route('/suggestions', methods=['GET'])
def get_suggestions():
    crops = Crop.query.all()
    if crops:
        return jsonify({"recommended_crops": [c.name for c in crops]}), 200
    else:
        return jsonify({"recommended_crops": ["tomato", "onion", "beans"]}), 200
