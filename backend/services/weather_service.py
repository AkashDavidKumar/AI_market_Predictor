import os
import requests

class WeatherService:
    @staticmethod
    def get_weather(location: str):
        api_key = os.environ.get('WEATHER_API_KEY')
        if not api_key:
            return WeatherService._get_mock_weather(location)
            
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                return {
                    "temperature": data.get("main", {}).get("temp", 30.0),
                    "rainfall": data.get("rain", {}).get("1h", 0.0),  # mm in last hour
                    "humidity": data.get("main", {}).get("humidity", 50)
                }
            else:
                return WeatherService._get_mock_weather(location)
        except Exception:
            return WeatherService._get_mock_weather(location)
            
    @staticmethod
    def _get_mock_weather(location: str):
        base_temp = 25.0 + (len(location) % 10)
        base_rain = float(len(location) % 50)
        return {
            "temperature": base_temp,
            "rainfall": base_rain,
            "humidity": 60
        }
