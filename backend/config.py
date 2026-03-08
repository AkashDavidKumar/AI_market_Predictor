import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default_secret')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'default_jwt_secret')
    
    # Defaults to SQLite if DATABASE_URL is somehow missing
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        'sqlite:///farm_ai.db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY', '')
