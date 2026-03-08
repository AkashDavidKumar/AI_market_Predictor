# AI Market Predictor Backend

This is a production-ready backend for the AI-Powered Wholesale Market Price Prediction & Farmer Assistant Platform.

## Requirements

- Python 3.9+
- MySQL (e.g., via XAMPP)

## Setup Instructions

1. **Clone and Install**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Database Setup**
   - Open your MySQL server (e.g., via XAMPP).
   - Create a database named `farm_ai`: 
     ```sql
     CREATE DATABASE farm_ai;
     ```
   - Copy `.env.example` to `.env` and adjust the `DATABASE_URL` appropriately if your MySQL configuration differs from defaults.
   - Example MySQL connection string format: `mysql+pymysql://root:@localhost/farm_ai`

3. **Initialize Database Tables**
   ```bash
   python -c "from app import create_app; from database.db_connection import db; app = create_app(); app.app_context().push(); db.create_all(); print('DB Initialized')"
   ```

4. **Train Initial ML Model**
   A small sample dataset is already provided in the `dataset` folder to quickly stand up the ML pipeline.
   ```bash
   python ml/train_model.py
   ```

5. **Run the Application**
   ```bash
   python app.py
   ```
   The Flask API will run on `http://127.0.0.1:5000`.

## System Architecture

The system strictly adheres to a **layered architecture** pattern:
- **Routes Layer**: Exposes and registers all REST endpoints (`routes/`).
- **Controllers Layer**: Deals with interpreting request JSON and structuring responses cleanly (`controllers/`).
- **Service Layer**: Houses core platform business logic (`services/`).
- **ML Layer**: Encapsulates algorithms, data preprocessing, and ML model interactions dynamically (`ml/`).
- **Models & Database Layer**: Includes SQLAlchemy ORM structured files targeting MySQL backend interactions (`models/`, `database/`).

## Core Business APIs

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
- **Predict Price**: `POST /api/predict-price`
- **Markets**: `GET /api/markets`, `GET /api/markets/recommend`
- **Crop Alternatives**: `GET /api/crop/suggestions`
- **Market Trends**: `GET /api/market-trends`
- **Price Alerts**: `POST /api/alerts/create`, `GET /api/alerts/user`
- **Farmer Chatbot**: `POST /api/chatbot`
- **Admin Management**: `POST /api/admin/upload-dataset` (Dynamically retrains the RandomForestRegressor on successful POST)

## Automated Tests
Ensure application routes and utilities pass functional checks by utilizing:
```bash
pytest tests/
```
