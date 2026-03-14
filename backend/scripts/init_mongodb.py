from pymongo import MongoClient
import sys
import os

# Ensure the parent directory is in the path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import Config
from utils.auth_utils import hash_password
import datetime

def init_db():
    print(f"Connecting to MongoDB at {Config.MONGO_URI}...")
    client = MongoClient(Config.MONGO_URI)
    db = client[Config.MONGO_DB_NAME]
    
    # Drop existing collections for a clean initialization
    collection_names = ["users", "crops", "markets", "market_prices", "predictions", "price_alerts"]
    for c in collection_names:
        db[c].drop()
        print(f"Dropped collection: {c}")

    # Seed Users
    users = db["users"]
    hashed_pass = hash_password('password123')
    user_id = users.insert_one({
        "name": "Test Farmer",
        "email": "farmer@test.com",
        "password": hashed_pass,
        "role": "farmer",
        "language": "en",
        "created_at": datetime.datetime.utcnow()
    }).inserted_id
    print("Inserted mock user.")

    # Seed Crops
    crops = db["crops"]
    crops.insert_many([
        {"name": "Wheat", "season": "Rabi", "profitability": 75.5, "created_at": datetime.datetime.utcnow()},
        {"name": "Rice", "season": "Kharif", "profitability": 68.2, "created_at": datetime.datetime.utcnow()},
        {"name": "Maize", "season": "Kharif", "profitability": 82.1, "created_at": datetime.datetime.utcnow()},
        {"name": "Cotton", "season": "Kharif", "profitability": 60.0, "created_at": datetime.datetime.utcnow()}
    ])
    print("Inserted mock crops.")

    # Seed Markets
    markets = db["markets"]
    markets.insert_many([
        {"name": "Azadpur", "location": "Delhi", "created_at": datetime.datetime.utcnow()},
        {"name": "Koyambedu", "location": "Chennai", "created_at": datetime.datetime.utcnow()},
        {"name": "Vashi", "location": "Mumbai", "created_at": datetime.datetime.utcnow()},
        {"name": "Ghazipur", "location": "Delhi", "created_at": datetime.datetime.utcnow()}
    ])
    print("Inserted mock markets.")

    # Seed Market Prices
    prices = db["market_prices"]
    import random
    from datetime import timedelta
    
    price_docs = []
    base_date = datetime.datetime.utcnow() - timedelta(days=50)
    for crop in ["Wheat", "Rice", "Maize", "Cotton"]:
        for market in ["Azadpur", "Koyambedu", "Vashi", "Ghazipur"]:
            for i in range(50):
                d = base_date + timedelta(days=i)
                base_price = 2000 if crop == "Wheat" else 2500 if crop == "Rice" else 1500 if crop == "Maize" else 4000
                price = base_price + random.randint(-200, 200)
                price_docs.append({
                    "crop_name": crop,
                    "market": market,
                    "date": d,
                    "price": price,
                    "created_at": datetime.datetime.utcnow()
                })
    prices.insert_many(price_docs)
    print("Inserted mock market prices.")

    print("\nDatabase initialization complete!")

if __name__ == "__main__":
    init_db()
