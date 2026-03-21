from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'ai_market_predictor')

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

user = db["users"].find_one()
if user:
    user['_id'] = str(user['_id'])
    print(user)
else:
    print("No users found.")
