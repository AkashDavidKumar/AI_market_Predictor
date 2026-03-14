from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from database.db_connection import db
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]}}, supports_credentials=True)
    jwt = JWTManager(app)
    
    # Register Blueprints
    from routes.auth_routes import auth_bp
    from routes.prediction_routes import prediction_bp
    from routes.market_routes import market_bp
    from routes.crop_routes import crop_bp
    from routes.analytics_routes import analytics_bp
    from routes.alert_routes import alert_bp
    from routes.admin_routes import admin_bp
    from routes.chatbot_routes import chatbot_bp
    from routes.dashboard_routes import dashboard_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(prediction_bp, url_prefix='/api')
    app.register_blueprint(market_bp, url_prefix='/api/markets')
    app.register_blueprint(crop_bp, url_prefix='/api/crop')
    app.register_blueprint(analytics_bp, url_prefix='/api')
    app.register_blueprint(alert_bp, url_prefix='/api/alerts')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    
    @app.route('/', methods=['GET'])
    def index():
        return jsonify({"message": "Welcome to the AI Market Predictor API"}), 200

    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({"status": "running"}), 200

    @app.route('/api/weather', methods=['GET'])
    def get_weather():
        from services.weather_service import WeatherService
        location = request.args.get('location', 'Delhi')
        weather = WeatherService.get_weather(location)
        # Add basic advisory logic for frontend
        weather['advisory'] = "Good for farming" if weather['temperature'] < 35 else "Heat alert"
        weather['condition'] = "Sunny" if weather.get('rainfall', 0) == 0 else "Rainy"
        return jsonify(weather), 200

    import os
    import logging
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model", "model.joblib")
    if not os.path.exists(model_path):
        logging.warning("ML model not found. Run python backend/ml/train_model.py")

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
