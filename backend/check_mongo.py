from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'ai_market_predictor')

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

collections = ["users", "crops", "markets", "market_prices", "price_alerts", "predictions"]

print(f"Checking database: {MONGO_DB_NAME}")
for coll in collections:
    count = db[coll].count_documents({})
    print(f"Collection '{coll}': {count} documents")

# Check if there are any prices
latest_price = db["market_prices"].find_one(sort=[("date", -1)])
print(f"Latest price: {latest_price}")
