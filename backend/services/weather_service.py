import os
import requests

class WeatherService:
    @staticmethod
    def get_weather(location: str = None, lat: str = None, lon: str = None):
        api_key = os.environ.get('WEATHER_API_KEY')
        if not api_key:
            return WeatherService._get_mock_weather(location or f"{lat},{lon}")
            
        try:
            if lat and lon:
                url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
            else:
                url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric"
                
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                return {
                    "location": data.get("name", location or "Unknown"),
                    "temperature": round(data.get("main", {}).get("temp", 30.0)),
                    "condition": "Rainy" if data.get("rain") else "Sunny",
                    "humidity": data.get("main", {}).get("humidity", 50),
                    "wind_speed": data.get("wind", {}).get("speed", 5)
                }
            else:
                return WeatherService._get_mock_weather(location or "Tirupattur")
        except Exception:
            return WeatherService._get_mock_weather(location or "Tirupattur")
            
    @staticmethod
    def _get_mock_weather(location: str):
        return {
            "location": location,
            "temperature": 31,
            "condition": "Sunny",
            "humidity": 60,
            "wind_speed": 8
        }
