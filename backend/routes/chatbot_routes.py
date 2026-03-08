from flask import Blueprint, request, jsonify

chatbot_bp = Blueprint('chatbot_bp', __name__)

@chatbot_bp.route('', methods=['POST'])
def chatbot():
    data = request.get_json()
    message = data.get('message', '').lower()
    
    if 'predict' in message or 'predicted price' in message:
        return jsonify({"response": "To predict a price, you can use our prediction API with crop name, market, and date."}), 200
    elif 'market' in message and 'best' in message:
        return jsonify({"response": "Our market recommendation system can tell you the best market. Just provide the crop and date."}), 200
    elif 'crop' in message and ('profitable' in message or 'best' in message):
        return jsonify({"response": "Currently, Kharif season crops like tomatoes and onions show high demand. Use our crop suggestion tool for details."}), 200
    else:
        return jsonify({"response": "I am a simple AI assistant. I can help you with crop suggestions, market comparisons, and price predictions. How can I assist you further?"}), 200
