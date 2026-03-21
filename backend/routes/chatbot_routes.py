from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from services.chatbot_service import ChatbotService

chatbot_bp = Blueprint('chatbot_bp', __name__)

@chatbot_bp.route('', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
@jwt_required(optional=True)
def chatbot():
    data = request.get_json()
    message = data.get('message', '')
    user_id = get_jwt_identity()
    
    if not message:
        return jsonify({"response": "I didn't catch that. Could you please repeat?"}), 400
        
    response_text = ChatbotService.get_assistant_response(message, user_id)
    return jsonify({"response": response_text}), 200
