from database.db_connection import crops_collection
import random

new_assets = [
    # Vegetables
    {"name": "Tomato", "category": "vegetables", "profitability": 85, "best_market": "Azadpur Mandi (Delhi)", "trend": "upward"},
    {"name": "Onion", "category": "vegetables", "profitability": 78, "best_market": "Lasalgaon Mandi (Nashik)", "trend": "stable"},
    {"name": "Potato", "category": "vegetables", "profitability": 70, "best_market": "Agra Mandi (UP)", "trend": "downward"},
    {"name": "Carrot", "category": "vegetables", "profitability": 65, "best_market": "Azadpur Mandi (Delhi)", "trend": "stable"},
    
    # Fruits
    {"name": "Apple", "category": "fruits", "profitability": 92, "best_market": "Azadpur Mandi (Delhi)", "trend": "upward"},
    {"name": "Mango", "category": "fruits", "profitability": 95, "best_market": "Vashi APMC (Mumbai)", "trend": "upward"},
    {"name": "Banana", "category": "fruits", "profitability": 88, "best_market": "Solapur Mandi (Maharashtra)", "trend": "stable"},
    {"name": "Grapes", "category": "fruits", "profitability": 82, "best_market": "Nashik Mandi", "trend": "downward"},
    
    # Seeds
    {"name": "Groundnut Seed", "category": "seeds", "profitability": 75, "best_market": "Junagadh Mandi (Gujarat)", "trend": "stable"},
    {"name": "Sunflower Seed", "category": "seeds", "profitability": 72, "best_market": "Kurnool Mandi (Andhra)", "trend": "upward"},
    {"name": "Mustard Seed", "category": "seeds", "profitability": 80, "best_market": "Jaipur Mandi (Rajasthan)", "trend": "stable"},
]

for asset in new_assets:
    # Check if exists
    if not crops_collection.find_one({"name": asset["name"]}):
        crops_collection.insert_one(asset)
        print(f"Added {asset['name']}")
    else:
        # Update category if missing
        crops_collection.update_one({"name": asset["name"]}, {"$set": {"category": asset["category"]}})
        print(f"Updated {asset['name']}")

# Ensure existing crops have categories
crops_collection.update_many({"name": {"$in": ["Wheat", "Rice", "Maize", "Cotton", "Soybean"]}}, {"$set": {"category": "crops"}})
print("Seeding complete.")
