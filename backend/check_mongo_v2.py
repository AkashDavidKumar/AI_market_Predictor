from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'ai_market_predictor')

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

collections = ["users", "crops", "markets", "market_prices", "price_alerts", "predictions"]

print(f"--- Database: {MONGO_DB_NAME} ---")
for coll in collections:
    count = db[coll].count_documents({})
    print(f"Collection '{coll}': {count} documents")

print("--- Sample Market Price ---")
latest_price = db["market_prices"].find_one(sort=[("date", -1)])
if latest_price:
    latest_price['_id'] = str(latest_price['_id'])
    print(latest_price)
else:
    print("No market prices found.")

print("--- Sample Crop ---")
sample_crop = db["crops"].find_one()
if sample_crop:
    sample_crop['_id'] = str(sample_crop['_id'])
    print(sample_crop)
else:
    print("No crops found.")
