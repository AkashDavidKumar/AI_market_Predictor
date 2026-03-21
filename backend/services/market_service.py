import datetime
from ml.predictor import predictor_instance
from services.weather_service import WeatherService
from database.db_connection import markets_collection

class MarketService:
    @staticmethod
    def get_all_markets():
        # Predefined categorized Indian mandis as requested
        categorized_markets = {
            "north_india": [
                "Azadpur Mandi (Delhi)",
                "Karnal Grain Market (Haryana)",
                "Ludhiana Mandi (Punjab)",
                "Amritsar Mandi"
            ],
            "south_india": [
                "Koyambedu Market (Chennai)",
                "KR Market (Bangalore)",
                "Madurai Mandi (Tamil Nadu)",
                "Erode Turmeric Market (Tamil Nadu)",
                "Guntur Chilli Market (Andhra Pradesh)"
            ],
            "west_india": [
                "Vashi APMC (Mumbai)",
                "Lasalgaon Mandi (Nashik - Onion Hub)",
                "Indore Mandi (Madhya Pradesh)",
                "Nagpur Mandi (Orange Market)"
            ],
            "east_india": [
                "Kolkata Wholesale Market",
                "Bhubaneswar Mandi",
                "Patna Mandi",
                "Guwahati Mandi"
            ]
        }
        
        # Merge with any database markets if they exist
        db_markets = [m.get("name") for m in list(markets_collection.find({}))]
        if db_markets:
             if "other" not in categorized_markets: categorized_markets["other"] = []
             categorized_markets["other"].extend([m for m in db_markets if m not in sum(categorized_markets.values(), [])])

        return {"markets": categorized_markets}, 200
            
    @staticmethod
    def recommend_market(crop_name, date_str):
        try:
            date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return {"error": "Invalid date format. Use YYYY-MM-DD"}, 400
            
        markets_dict, _ = MarketService.get_all_markets()
        # Flatten dictionary values into a single list of market names
        markets = [m for sublist in markets_dict["markets"].values() for m in sublist]
        
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
