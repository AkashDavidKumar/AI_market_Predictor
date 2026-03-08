from flask import request, jsonify
from services.auth_service import AuthService

class AuthController:
    @staticmethod
    def register():
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({"error": "Missing required fields: name, email, password"}), 400
            
        response, status_code = AuthService.register_user(
            name=data.get('name'),
            email=data.get('email'),
            password=data.get('password'),
            role=data.get('role', 'farmer'),
            language=data.get('language', 'en')
        )
        return jsonify(response), status_code

    @staticmethod
    def login():
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Missing email or password"}), 400
            
        response, status_code = AuthService.login_user(
            email=data.get('email'),
            password=data.get('password')
        )
        return jsonify(response), status_code
