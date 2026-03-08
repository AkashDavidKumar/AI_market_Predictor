import os
import sys
import datetime
import random
import pymysql

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from database.db_connection import db
from models.crop_model import Crop
from models.market_model import Market
from models.price_model import MarketPrice
from models.user_model import User
from utils.auth_utils import hash_password

def seed_database():
    app = create_app()
    with app.app_context():
        print("Creating tables if they do not exist...")
        db.create_all()

        print("Seeding Users...")
        if not User.query.filter_by(email="admin@farm.ai").first():
            admin = User(name="Admin User", email="admin@farm.ai", password=hash_password("admin123"), role="admin")
            db.session.add(admin)
        if not User.query.filter_by(email="farmer@farm.ai").first():
            farmer = User(name="Test Farmer", email="farmer@farm.ai", password=hash_password("farmer123"), role="farmer")
            db.session.add(farmer)
            
        print("Seeding Crops and Markets...")
        crops = ['tomato', 'onion', 'potato', 'cabbage', 'brinjal']
        markets = ['Koyambedu', 'Salem', 'Madurai', 'Coimbatore']
        seasons = ['Kharif', 'Rabi', 'Zaid']
        
        for crop_name in crops:
            if not Crop.query.filter_by(name=crop_name).first():
                db.session.add(Crop(name=crop_name, season=random.choice(seasons)))
                
        for market_name in markets:
            if not Market.query.filter_by(name=market_name).first():
                db.session.add(Market(name=market_name, location=market_name))
                
        db.session.commit()

        print("Seeding Historical Market Prices...")
        if MarketPrice.query.count() < 20:
            start_date = datetime.date(2024, 1, 1)
            for _ in range(50):
                random_date = start_date + datetime.timedelta(days=random.randint(0, 365))
                random_crop = random.choice(crops)
                random_market = random.choice(markets)
                random_price = round(random.uniform(15.0, 60.0), 2)
                random_rainfall = round(random.uniform(0.0, 50.0), 1)
                random_temp = round(random.uniform(20.0, 40.0), 1)
                random_season = random.choice(seasons)
                
                mp = MarketPrice(
                    date=random_date,
                    crop_name=random_crop,
                    market=random_market,
                    price=random_price,
                    rainfall=random_rainfall,
                    temperature=random_temp,
                    season=random_season
                )
                db.session.add(mp)
            db.session.commit()
            
        print("Database visualization and seeding complete!")

if __name__ == '__main__':
    seed_database()
