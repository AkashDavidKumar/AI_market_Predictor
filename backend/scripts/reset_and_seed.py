from pymongo import MongoClient
import sys
import os
import datetime
import random
from datetime import timedelta

# Ensure the parent directory is in the path to import config and utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import Config
from utils.auth_utils import hash_password

def reset_and_seed():
    print(f"Connecting to MongoDB at {Config.MONGO_URI}...")
    client = MongoClient(Config.MONGO_URI)
    db = client[Config.MONGO_DB_NAME]
    
    # Collections to clear
    collection_names = ["users", "crops", "markets", "market_prices", "predictions", "price_alerts"]
    for c in collection_names:
        db[c].drop()
        print(f"Dropped collection: {c}")

    # 1. Seed Users
    users = db["users"]
    user_data = [
        {
            "name": "Akash Kumar",
            "email": "akash@gmail.com",
            "password": hash_password("1234"),
            "role": "farmer",
            "language": "en",
            "created_at": datetime.datetime.utcnow()
        },
        {
            "name": "Admin User",
            "email": "admin@gmail.com",
            "password": hash_password("admin123"),
            "role": "admin",
            "language": "en",
            "created_at": datetime.datetime.utcnow()
        }
    ]
    users.insert_many(user_data)
    print(f"Inserted {len(user_data)} user accounts.")

    # 2. Seed Crops
    crops_col = db["crops"]
    crop_list = [
        {"name": "Wheat", "season": "Rabi", "profitability": 78.5},
        {"name": "Rice", "season": "Kharif", "profitability": 72.0},
        {"name": "Maize", "season": "Kharif", "profitability": 85.2},
        {"name": "Cotton", "season": "Kharif", "profitability": 65.0},
        {"name": "Sugarcane", "season": "Annual", "profitability": 90.5},
        {"name": "Onion", "season": "Rabi", "profitability": 55.0}
    ]
    for c in crop_list:
        c["created_at"] = datetime.datetime.utcnow()
    crops_col.insert_many(crop_list)
    print(f"Inserted {len(crop_list)} crops.")

    # 3. Seed Markets
    markets_col = db["markets"]
    market_list = [
        {"name": "Azadpur", "location": "Delhi"},
        {"name": "Koyambedu", "location": "Chennai"},
        {"name": "Vashi", "location": "Mumbai"},
        {"name": "Ghazipur", "location": "Delhi"},
        {"name": "Gultekdi", "location": "Pune"}
    ]
    for m in market_list:
        m["created_at"] = datetime.datetime.utcnow()
    markets_col.insert_many(market_list)
    print(f"Inserted {len(market_list)} markets.")

    # 4. Seed Market Prices (Last 30 days)
    prices_col = db["market_prices"]
    price_docs = []
    base_date = datetime.datetime.utcnow() - timedelta(days=30)
    
    crops_for_prices = ["Wheat", "Rice", "Maize", "Cotton", "Onion"]
    markets_for_prices = ["Azadpur", "Koyambedu", "Vashi", "Ghazipur", "Gultekdi"]

    for crop in crops_for_prices:
        for market in markets_for_prices:
            # Set a base price for the crop/market pair
            base_price = {
                "Wheat": 2100,
                "Rice": 3000,
                "Maize": 1800,
                "Cotton": 6000,
                "Onion": 1500
            }[crop] + random.randint(-100, 100)
            
            for i in range(30):
                d = base_date + timedelta(days=i)
                # Add some random walk to the price
                price = base_price + random.randint(-50, 50)
                base_price = price # sequential price movement
                
                price_docs.append({
                    "crop_name": crop,
                    "market": market,
                    "date": d,
                    "price": price,
                    "created_at": datetime.datetime.utcnow()
                })
    
    prices_col.insert_many(price_docs)
    print(f"Inserted {len(price_docs)} historical market price records.")

    print("\nDatabase RESET and SEEDING complete!")
    print("Test Accounts:")
    print("  Farmer: akash@gmail.com / 1234")
    print("  Admin:  admin@gmail.com / admin123")

if __name__ == "__main__":
    reset_and_seed()
