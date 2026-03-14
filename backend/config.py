import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    
    # Database Configuration (MongoDB)
    MONGO_URI = os.getenv('MONGO_URI')
    MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')
