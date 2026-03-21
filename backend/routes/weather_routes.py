from flask import Blueprint, jsonify

weather_bp = Blueprint('weather_bp', __name__)

@weather_bp.route('/weather', methods=['GET'])
def get_weather():
    from services.weather_service import WeatherService
    from flask import request
    location = request.args.get('location')
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    weather_data = WeatherService.get_weather(location=location, lat=lat, lon=lon)
    return jsonify(weather_data), 200
