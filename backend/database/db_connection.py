from pymongo import MongoClient
from config import Config

# Initialize MongoDB Client
client = MongoClient(Config.MONGO_URI)
db = client[Config.MONGO_DB_NAME]

# Collections
users_collection = db["users"]
crops_collection = db["crops"]
markets_collection = db["markets"]
prices_collection = db["market_prices"]
alerts_collection = db["price_alerts"]
predictions_collection = db["predictions"]
notifications_collection = db["notifications"]

# Performance Indexes
print("Initializing Database Indexes...")
prices_collection.create_index([("crop", 1), ("market", 1), ("date", -1)])
crops_collection.create_index([("name", 1)])
notifications_collection.create_index([("user_id", 1), ("created_at", -1)])
predictions_collection.create_index([("user_id", 1), ("created_at", -1)])
print("Database Indexes initialized successfully.")
