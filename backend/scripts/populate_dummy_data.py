import os
import random
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'ai_market_predictor')

def populate_data():
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    
    # Requirement 6: dummy market data for Requirement 8 (data.md)
    dummy_data = [
        {"id": 1, "asset_name": "Bitcoin", "asset_type": "crypto", "price": 65000.50, "predicted_price": 67000.00, "trend": "up", "timestamp": datetime.now().isoformat()},
        {"id": 2, "asset_name": "Ethereum", "asset_type": "crypto", "price": 3500.25, "predicted_price": 3400.00, "trend": "down", "timestamp": datetime.now().isoformat()},
        {"id": 3, "asset_name": "Apple Inc.", "asset_type": "stock", "price": 175.80, "predicted_price": 180.50, "trend": "up", "timestamp": datetime.now().isoformat()},
        {"id": 4, "asset_name": "Tesla", "asset_type": "stock", "price": 170.10, "predicted_price": 165.00, "trend": "down", "timestamp": datetime.now().isoformat()},
        {"id": 5, "asset_name": "NVIDIA", "asset_type": "stock", "price": 900.00, "predicted_price": 950.00, "trend": "up", "timestamp": datetime.now().isoformat()},
        {"id": 6, "asset_name": "Solana", "asset_type": "crypto", "price": 145.20, "predicted_price": 155.00, "trend": "up", "timestamp": datetime.now().isoformat()},
        {"id": 7, "asset_name": "Microsoft", "asset_type": "stock", "price": 420.00, "predicted_price": 425.00, "trend": "up", "timestamp": datetime.now().isoformat()},
        {"id": 8, "asset_name": "Amazon", "asset_type": "stock", "price": 180.00, "predicted_price": 175.00, "trend": "down", "timestamp": datetime.now().isoformat()},
    ]
    
    collection = db["dummy_market_data"]
    collection.delete_many({})
    collection.insert_many(dummy_data)
    
    # Now populate actual application collections to make the Dashboard and Analytics work
    
    # 1. Crops
    crops = [
        {"name": "Wheat", "season": "Rabi", "profitability": 85, "expected_price": 2200, "best_market": "Nagpur", "trend": "up"},
        {"name": "Rice", "season": "Kharif", "profitability": 70, "expected_price": 2900, "best_market": "Delhi", "trend": "stable"},
        {"name": "Soybean", "season": "Kharif", "profitability": 90, "expected_price": 4600, "best_market": "Indore", "trend": "up"},
        {"name": "Cotton", "season": "Kharif", "profitability": 80, "expected_price": 6000, "best_market": "Mumbai", "trend": "down"},
        {"name": "Maize", "season": "Kharif", "profitability": 65, "expected_price": 1800, "best_market": "Delhi", "trend": "up"}
    ]
    db["crops"].delete_many({})
    db["crops"].insert_many(crops)
    
    # 2. Markets
    markets = [
        {"name": "Delhi", "location": "Delhi"},
        {"name": "Nagpur", "location": "Maharashtra"},
        {"name": "Indore", "location": "Madhya Pradesh"},
        {"name": "Mumbai", "location": "Maharashtra"}
    ]
    db["markets"].delete_many({})
    db["markets"].insert_many(markets)
    
    # 3. Market Prices (Historicals for Trends)
    prices = []
    base_date = datetime.now()
    for i in range(30): # 30 days of data
        date = base_date - timedelta(days=i)
        for crop in crops:
            for market in markets:
                # Random realistic fluctuation
                price = 2000 + random.randint(-200, 500) if crop["name"] == "Wheat" else 4000 + random.randint(-500, 1000)
                prices.append({
                    "crop_name": crop["name"],
                    "market": market["name"],
                    "date": date, # datetime object
                    "price": price,
                    "rainfall": random.uniform(0, 20),
                    "temperature": random.uniform(20, 35),
                    "season": crop["season"]
                })
    db["market_prices"].delete_many({})
    db["market_prices"].insert_many(prices)
    
    # 4. Alerts
    alerts = [
        {"crop_name": "Wheat", "target_price": 2200, "condition": "above", "is_active": True, "created_at": datetime.now()},
        {"crop_name": "Soybean", "target_price": 4500, "condition": "below", "is_active": False, "created_at": datetime.now()}
    ]
    db["price_alerts"].delete_many({})
    db["price_alerts"].insert_many(alerts)

    print(f"Inserted dummy records into all collections.")
    
    # Generate data.md
    data_md_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data.md')
    with open(data_md_path, 'w') as f:
        f.write("# Dummy Market Data\n\n")
        f.write("| ID | Asset | Type | Price | Predicted Price | Trend | Timestamp |\n")
        f.write("| -- | ----- | ---- | ----- | --------------- | ----- | --------- |\n")
        for item in dummy_data:
            f.write(f"| {item['id']} | {item['asset_name']} | {item['asset_type']} | {item['price']} | {item['predicted_price']} | {item['trend']} | {item['timestamp']} |\n")
    
    print(f"Generated {data_md_path}")

if __name__ == "__main__":
    populate_data()
