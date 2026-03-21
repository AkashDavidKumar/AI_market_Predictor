from flask import Blueprint, jsonify
from database.db_connection import prices_collection
import datetime

current_price_bp = Blueprint('current_price_bp', __name__)

def doc_to_dict(doc):
    if doc is None: return None
    d = dict(doc)
    if '_id' in d:
        d['id'] = str(d.pop('_id'))
    return d

@current_price_bp.route('', methods=['GET'])
def get_current_prices():
    # Fetch the latest price for each unique crop in the system
    pipeline = [
        {"$sort": {"date": -1}},
        {
            "$group": {
                "_id": "$crop",
                "item": {"$first": "$crop"},
                "market": {"$first": "$market"},
                "current_price": {"$first": "$price"},
                "date": {"$first": "$date"}
            }
        }
    ]
    
    latest_prices = list(prices_collection.aggregate(pipeline))
    
    # If database is sparse, add some realistic defaults for the demo
    # so we don't see the same fallback value for everything
    if len(latest_prices) < 5:
        defaults = [
            {"item": "Wheat", "market": "Nagpur Mandi", "current_price": 2150},
            {"item": "Rice", "market": "Karnal", "current_price": 1980},
            {"item": "Tomato", "market": "Azadpur Mandi", "current_price": 32},
            {"item": "Apple", "market": "Azadpur Mandi", "current_price": 120},
            {"item": "Mango", "market": "Vashi APMC", "current_price": 150},
        ]
        # Only add defaults if they aren't already in the results
        existing_items = [p['item'] for p in latest_prices]
        for d in defaults:
            if d['item'] not in existing_items:
                latest_prices.append(d)

    return jsonify(latest_prices), 200
