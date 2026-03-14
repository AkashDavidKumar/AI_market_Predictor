import datetime
from ml.predictor import predictor_instance
from services.weather_service import WeatherService
from database.db_connection import markets_collection

class MarketService:
    @staticmethod
    def get_all_markets():
        markets = list(markets_collection.find({}))
        if markets:
            return {"markets": [m.get("name") for m in markets]}, 200
        else:
            return {"markets": ["Koyambedu", "Salem", "Madurai"]}, 200
            
    @staticmethod
    def recommend_market(crop_name, date_str):
        try:
            date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return {"error": "Invalid date format. Use YYYY-MM-DD"}, 400
            
        markets_response, _ = MarketService.get_all_markets()
        markets = markets_response["markets"]
        
        month = date_obj.month
        season = 'Rabi' if month in [10, 11, 12, 1, 2, 3] else 'Kharif'
        
        best_market = None
        highest_price = -1
        predictions = []
        
        for market in markets:
            weather_data = WeatherService.get_weather(market)
            try:
                predicted_price = predictor_instance.predict(
                    crop_name=crop_name,
                    market=market,
                    date=date_obj,
                    rainfall=weather_data.get('rainfall', 0),
                    temperature=weather_data.get('temperature', 30),
                    season=season
                )
                predictions.append({"market": market, "predicted_price": round(predicted_price, 2)})
                if predicted_price > highest_price:
                    highest_price = predicted_price
                    best_market = market
            except Exception:
                continue
                
        if best_market:
            return {
                "best_market": best_market,
                "predicted_price": round(highest_price, 2),
                "comparisons": predictions
            }, 200
        else:
            return {"error": "Could not generate recommendations"}, 500
