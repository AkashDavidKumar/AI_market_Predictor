from database.db_connection import notifications_collection
from datetime import datetime, timedelta
import random

def seed_notifications():
    user_id = "69b58b0b9ad0df4599e53168"
    
    # Clear existing notifications for this user (optional)
    # notifications_collection.delete_many({"user_id": user_id})
    
    sample_notifications = [
        {
            "user_id": user_id,
            "title": "Market Surge",
            "message": "Tomato prices in Koyambedu are up by 20% today!",
            "time": "Just now",
            "created_at": datetime.now()
        },
        {
            "user_id": user_id,
            "title": "Weather Warning",
            "message": "Moderate rain expected in Nagpur. Protect your harvested wheat.",
            "time": "1 hour ago",
            "created_at": datetime.now() - timedelta(hours=1)
        },
        {
            "user_id": user_id,
            "title": "AI Recommendation",
            "message": "Sell your Potato stock now for maximum profit in Azadpur Mandi.",
            "time": "3 hours ago",
            "created_at": datetime.now() - timedelta(hours=3)
        },
        {
            "user_id": user_id,
            "title": "Price Drop",
            "message": "Onion prices in Lasalgaon have stabilized.",
            "time": "1 day ago",
            "created_at": datetime.now() - timedelta(days=1)
        }
    ]
    
    notifications_collection.insert_many(sample_notifications)
    print(f"Successfully seeded {len(sample_notifications)} notifications for user {user_id}")

if __name__ == "__main__":
    seed_notifications()
