# ROLE

You are a **Principal Backend Architect, Machine Learning Engineer, and DevOps Engineer**.

Your task is to design and generate a **production-ready backend system** for an **AI-Powered Wholesale Market Price Prediction & Farmer Assistant Platform**.

The system will help farmers make **data-driven decisions about crop selling and crop selection**.

The backend must follow **clean architecture, modular design, REST API principles, and scalable system design**.

You must produce **well-structured code, documentation, and architecture explanation**.

---

# SYSTEM PURPOSE

The system helps farmers by:

• Predicting future crop prices in wholesale markets  
• Recommending the best market to sell crops  
• Suggesting profitable crops based on season and demand  
• Providing market price analytics  
• Integrating weather information  
• Sending price alerts  
• Providing a chatbot assistant for farmers  
• Allowing administrators to manage datasets  

The backend must support **integration with a React frontend**.

---

# TECHNOLOGY STACK

Backend Framework  
Python **Flask**

Machine Learning  
scikit-learn  
pandas  
numpy  
joblib  

Database  
MySQL  
SQLAlchemy ORM

Authentication  
Flask-JWT-Extended

Other Libraries  
Flask-CORS  
requests  
python-dotenv  
Werkzeug security

Optional Enhancements  
Celery (for background jobs)  
Redis (for task queue)

---

# SYSTEM ARCHITECTURE

Design the system using **layered architecture**:

Controller Layer  
Service Layer  
ML Layer  
Database Layer  
Utility Layer

Structure the project in a clean and scalable way.

---

# COMPLETE PROJECT STRUCTURE

backend/

app.py  
config.py  
requirements.txt  

routes/  
auth_routes.py  
prediction_routes.py  
market_routes.py  
analytics_routes.py  
admin_routes.py  
alert_routes.py  
chatbot_routes.py  

controllers/  
auth_controller.py  
prediction_controller.py  
market_controller.py  
admin_controller.py  

services/  
prediction_service.py  
market_service.py  
crop_service.py  
weather_service.py  
alert_service.py  

models/  
user_model.py  
crop_model.py  
market_model.py  
price_model.py  
alert_model.py  

ml/  
train_model.py  
predictor.py  
data_preprocessing.py  

database/  
db_connection.py  

utils/  
auth_utils.py  
validators.py  
logger.py  

dataset/

model/

docs/

README.md

---

# CORE SYSTEM MODULES

## 1 Authentication System

Implement JWT-based authentication.

Endpoints:

POST /api/auth/register  
POST /api/auth/login  

Features:

password hashing  
JWT token generation  
role-based access (farmer, admin)

User table:

id  
name  
email  
password  
role  
language  
created_at  

---

# 2 Machine Learning Price Prediction System

Create a machine learning pipeline to predict crop prices.

Dataset Fields:

date  
crop_name  
market  
price  
rainfall  
temperature  
season  

Steps:

1 Load dataset  
2 Clean and preprocess data  
3 Encode categorical values  
4 Train model  
5 Save trained model  

Model:

RandomForestRegressor

Save model using joblib.

Prediction API:

POST /api/predict-price

Request:

{
"crop_name": "tomato",
"market": "koyambedu",
"date": "2026-07-01"
}

Response:

{
"predicted_price": 34.5
}

---

# 3 Market Recommendation System

Recommend the most profitable market for a crop.

Logic:

Predict price across multiple markets  
Compare predicted values  
Return highest profitable market

Endpoint:

GET /api/recommend-market?crop=tomato

Response:

{
"best_market": "koyambedu",
"predicted_price": 36
}

---

# 4 Crop Recommendation System

Suggest crops based on:

season  
weather conditions  
market demand  
historical prices  

Endpoint:

GET /api/crop-suggestions

Response:

{
"recommended_crops": [
"tomato",
"onion",
"beans"
]
}

---

# 5 Market Analytics Module

Provide data for visualizations.

Endpoint:

GET /api/market-trends?crop=tomato

Return:

historical price data  
trend analysis  

Response:

{
"dates": [],
"prices": []
}

---

# 6 Weather Integration

Integrate external weather API.

Weather data includes:

temperature  
rainfall  
humidity  

Endpoint:

GET /api/weather?location=chennai

Response:

{
"temperature": 32,
"rainfall": 5
}

Weather data should influence crop suggestions.

---

# 7 Price Alert System

Farmers can set price alerts.

Example:

Notify when tomato price reaches ₹30.

Table: PriceAlerts

Fields:

id  
user_id  
crop_name  
target_price  
created_at  

Endpoints:

POST /api/alerts/create  
GET /api/alerts/user  

---

# 8 Admin Panel Backend

Admin can:

upload datasets  
manage crops  
manage markets  
view system users  

Endpoints:

POST /api/admin/upload-dataset  
GET /api/admin/users  
POST /api/admin/add-crop  
POST /api/admin/add-market  

Dataset upload should retrain the ML model.

---

# 9 Farmer AI Assistant Chatbot

Create a chatbot API.

Endpoint:

POST /api/chatbot

It should answer questions like:

• Which crop is profitable this month?  
• What is the predicted price of onion?  
• Which market is best to sell tomatoes?

Use rule-based logic or simple ML.

---

# DATABASE TABLES

Users  
Crops  
Markets  
MarketPrices  
Predictions  
PriceAlerts  

Define SQLAlchemy models for each table.

---

# MACHINE LEARNING PIPELINE

Create scripts:

train_model.py  
predictor.py  

Pipeline steps:

dataset loading  
feature engineering  
model training  
model evaluation  
model saving  

Include evaluation metrics.

---

# API DESIGN REQUIREMENTS

All APIs must:

use JSON format  
include proper status codes  
include validation  
include error handling  

Example:

200 success  
400 bad request  
401 unauthorized  
500 server error

---

# SECURITY REQUIREMENTS

Implement:

JWT authentication  
password hashing  
input validation  
role-based access for admin routes

---

# DOCUMENTATION REQUIREMENTS

Generate documentation including:

System architecture explanation  
API documentation  
Database schema explanation  
ML model explanation  

---

# TESTING

Include example API requests for:

register  
login  
predict price  
crop suggestion  

---

# DEPLOYMENT PREPARATION

Prepare project for deployment.

Include:

requirements.txt  
environment configuration  
instructions for running backend  

Example run command:

python app.py

---

# EXPECTED OUTPUT

Generate:

1 Full backend project code  
2 Database schema  
3 ML training scripts  
4 REST APIs  
5 Authentication system  
6 Admin dataset management  
7 Price prediction system  
8 Chatbot API  
9 Documentation  
10 Deployment instructions