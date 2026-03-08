import datetime
from ml.predictor import predictor_instance
from services.weather_service import WeatherService
from models.price_model import Prediction
from database.db_connection import db

class PredictionService:
    @staticmethod
    def predict_price(crop_name, market, date_str, user_id=None):
        try:
            date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return {"error": "Invalid date format. Use YYYY-MM-DD"}, 400
            
        weather_data = WeatherService.get_weather(market)
        
        month = date_obj.month
        season = 'Rabi' if month in [10, 11, 12, 1, 2, 3] else 'Kharif'
        
        try:
            predicted_price = predictor_instance.predict(
                crop_name=crop_name,
                market=market,
                date=date_obj,
                rainfall=weather_data.get('rainfall', 0),
                temperature=weather_data.get('temperature', 30),
                season=season
            )
            
            prediction_record = Prediction(
                user_id=user_id, # Can be None if anonymous
                crop_name=crop_name,
                market=market,
                predicted_date=date_obj,
                predicted_price=predicted_price
            )
            db.session.add(prediction_record)
            db.session.commit()
            
            return {
                "predicted_price": round(predicted_price, 2),
                "weather_used": weather_data,
                "season": season
            }, 200
            
        except Exception as e:
            return {"error": str(e)}, 500
