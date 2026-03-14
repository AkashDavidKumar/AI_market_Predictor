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
