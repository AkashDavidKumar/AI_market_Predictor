import pandas as pd
import random
import datetime

crops = ["Soybean", "Wheat", "Cotton", "Rice", "Tomato", "Onion"]
markets = ["Delhi", "Mumbai", "Pune", "Salem", "Indore", "Nagpur"]
seasons = ["Kharif", "Rabi"]

data = []
start_date = datetime.datetime(2025, 1, 1)

for i in range(200):
    date = start_date + datetime.timedelta(days=i)
    crop = random.choice(crops)
    market = random.choice(markets)
    
    # Base prices
    if crop == "Soybean":
        price = random.uniform(1500, 2200)
    elif crop == "Wheat":
        price = random.uniform(2000, 2800)
    elif crop == "Cotton":
        price = random.uniform(5500, 7000)
    else:
        price = random.uniform(20, 100)
        
    rainfall = random.uniform(0, 100)
    temperature = random.uniform(15, 40)
    season = "Rabi" if date.month in [10, 11, 12, 1, 2, 3] else "Kharif"
    
    data.append({
        "date": date.strftime('%Y-%m-%d'),
        "crop_name": crop,
        "market": market,
        "price": round(price, 2),
        "rainfall": round(rainfall, 2),
        "temperature": round(temperature, 2),
        "season": season
    })

df = pd.DataFrame(data)
df.to_csv("backend/dataset/market_data.csv", index=False)
print("Updated market_data.csv with 200 robust records.")
