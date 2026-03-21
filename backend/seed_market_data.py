from database.db_connection import prices_collection
import datetime
import random

def seed_market_data():
    combinations = [
        ("Wheat", "Kolkata Wholesale Market"),
        ("Wheat", "Delhi Mandi"),
        ("Rice", "Mumbai APMC"),
        ("Tomato", "Koyambedu Market (Chennai)"),
        ("Onion", "Lasalgaon Mandi")
    ]
    
    today = datetime.datetime.now()
    
    for crop, market in combinations:
        base = 2200 if crop == "Wheat" else 1900 if crop == "Rice" else 40 if crop == "Tomato" else 30
        
        for i in range(15):
            date = (today - datetime.timedelta(days=i)).strftime('%Y-%m-%d')
            price = base + random.randint(-100, 100) if base > 100 else base + random.randint(-5, 5)
            
            prices_collection.update_one(
                {"crop": crop, "market": market, "date": date},
                {"$set": {
                    "crop": crop,
                    "market": market,
                    "price": price,
                    "date": date,
                    "created_at": today
                }},
                upsert=True
            )
            
    print("Database seeding successful for common combinations.")

if __name__ == "__main__":
    seed_market_data()
