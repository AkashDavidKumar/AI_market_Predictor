from database.db_connection import prices_collection
import datetime
import random

def seed_prices():
    # Comprehensive list of assets
    assets = [
        # Crops (₹/Quintal)
        {"crop": "Wheat", "base": 2200, "market": "Azadpur Mandi (Delhi)"},
        {"crop": "Rice", "base": 1900, "market": "Karnal Mandi"},
        {"crop": "Maize", "base": 1800, "market": "Ludhiana Mandi"},
        {"crop": "Cotton", "base": 6000, "market": "Vashi APMC (Mumbai)"},
        {"crop": "Soybean", "base": 4200, "market": "Indore Mandi"},
        
        # Vegetables (₹/Kg)
        {"crop": "Tomato", "base": 30, "market": "Koyambedu Market (Chennai)"},
        {"crop": "Onion", "base": 25, "market": "Lasalgaon Mandi (Nashik)"},
        {"crop": "Potato", "base": 18, "market": "Agra Mandi"},
        {"crop": "Carrot", "base": 45, "market": "Azadpur Mandi (Delhi)"},
        
        # Fruits (₹/Kg)
        {"crop": "Apple", "base": 110, "market": "Azadpur Mandi (Delhi)"},
        {"crop": "Mango", "base": 150, "market": "Vashi APMC (Mumbai)"},
        {"crop": "Banana", "base": 40, "market": "Solapur Mandi"},
        {"crop": "Grapes", "base": 80, "market": "Nashik Mandi"},
        
        # Seeds (₹/Quintal)
        {"crop": "Groundnut Seed", "base": 5500, "market": "Junagadh Mandi"},
        {"crop": "Sunflower Seed", "base": 5200, "market": "Kurnool Mandi"},
    ]
    
    today = datetime.datetime.now()
    
    for asset in assets:
        # Add a record for today
        price = asset["base"] + random.randint(-200, 200) if asset["base"] > 100 else asset["base"] + random.randint(-5, 5)
        record = {
            "crop": asset["crop"],
            "market": asset["market"],
            "price": max(1, price),
            "date": today.strftime('%Y-%m-%d'),
            "created_at": today
        }
        # Insert or update
        prices_collection.update_one(
            {"crop": asset["crop"], "date": record["date"]},
            {"$set": record},
            upsert=True
        )
        print(f"Seeded {asset['crop']} at {record['market']} - ₹{record['price']}")

    print("Price seeding complete.")

if __name__ == "__main__":
    seed_prices()
