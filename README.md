# AI Powered Wholesale Market Price Prediction & Farmer Assistant

## Project Description
The AI Powered Wholesale Market Price Prediction & Farmer Assistant is a comprehensive platform designed to empower farmers with data-driven insights. By leveraging historical market data and hyper-local weather conditions, the system accurately predicts wholesale crop prices, recommends the most profitable markets, and suggests suitable crops for cultivation. This platform bridges the information gap, ensuring farmers get optimal returns for their yield while assisting them with an AI chatbot and timely price alerts.

## Key Features
* **AI Market Price Prediction**: Forecasts crop prices using a trained Machine Learning model.
* **Market Recommendation System**: Recommends the best market to sell crops for maximum profit.
* **Crop Suggestion System**: Suggests profitable crops based on seasonality and conditions.
* **Weather Integration**: Integrates real-time and mock weather data for accurate predictions.
* **Farmer Dashboard APIs**: A complete suite of REST APIs to power a dynamic frontend dashboard.
* **Admin Dataset Upload**: Allows administrators to directly upload CSV datasets to auto-retrain the ML model dynamically.
* **Price Alerts**: Farmers can set target price alerts for specific crops.
* **AI Chatbot**: Rule-based AI assistant to answer farmer queries.
* **REST API Architecture**: Clean, secure (JWT-based), and well-documented endpoints.

## Technology Stack

**Frontend (if used):**
* React.js
* Tailwind CSS
* Chart.js

**Backend:**
* Python Flask
* SQLAlchemy ORM
* MySQL (XAMPP compatible)
* PyJWT (Flask-JWT-Extended)

**Machine Learning:**
* scikit-learn
* pandas
* numpy
* joblib

## System Architecture
The platform strictly follows a layered architecture pattern to ensure maintainability and scalability:
* **Routes Layer**: Handles HTTP requests, enforces authentication, and directs traffic.
* **Controllers Layer**: Validates incoming inputs, parses JSON, and structures API responses.
* **Services Layer**: Houses the core business logic (e.g., market comparison, alerting logic).
* **ML Layer**: Encapsulates model training pipelines, data preprocessing, and live predictions.
* **Database Layer**: SQLAlchemy models representing the MySQL schema.

## Folder Structure
```text
.
├── backend/
│   ├── app.py                 # Application entry point
│   ├── config.py              # Environment and DB configuration
│   ├── requirements.txt       # Python dependencies
│   ├── controllers/           # Request handlers
│   ├── database/              # DB setup scripts (setup.sql, init_db.py)
│   ├── dataset/               # Market CSV data
│   ├── ml/                    # Data preprocessing, training script, predictor
│   ├── model/                 # Saved joblib models
│   ├── models/                # SQLAlchemy database definitions
│   ├── routes/                # Flask blueprints
│   ├── services/              # Business logic interfaces
│   ├── tests/                 # Pytest suites
│   └── utils/                 # Security and auxiliary functions
├── frontend/                  # (Placeholder for frontend assets)
├── README.md                  # Project documentation
└── updates.md                 # AI-assisted development tracking log
```

## Installation Guide
To run the project locally, follow these steps:

1. **Start XAMPP MySQL**
   Open XAMPP Control Panel and start the MySQL module.

2. **Create Database**
   Access phpMyAdmin or the MySQL console and create a database named `farm_ai`.
   ```sql
   CREATE DATABASE IF NOT EXISTS farm_ai;
   ```

3. **Run Database Setup**
   Ensure your virtual environment is activated, dependencies are installed (`pip install -r backend/requirements.txt`), and `.env` is configured.
   ```bash
   python backend/database/init_db.py
   ```

4. **Train ML Model**
   Generate the initial `model.joblib` and `encoders.joblib` by running the training script.
   ```bash
   python backend/ml/train_model.py
   ```

5. **Run Backend Server**
   Start the Flask application.
   ```bash
   python backend/app.py
   ```
   The API will be available at `http://127.0.0.1:5000`.

## API Endpoints
Here are the core endpoints provided by the backend:
* `POST /api/auth/register` - Register a new farmer/admin.
* `POST /api/auth/login` - Authenticate and receive a JWT.
* `GET /api/markets` - Retrieve all available markets.
* `POST /api/predict-price` - Predict the future price of a crop.
* `GET /api/markets/recommend` - Get the best market for a specific crop.
* `GET /api/crop/suggestions` - Receive crop cultivation suggestions.
* `POST /api/admin/upload-dataset` - Upload a CSV and dynamically retrain the ML model.
* `POST /api/chatbot` - Interact with the farmer assistant chatbot.
* `GET /api/health` - Check backend server status.

## Machine Learning Model
The system utilizes a **RandomForestRegressor** from `scikit-learn` to establish non-linear relationships between independent variables and market prices.
* **Dataset Fields**: The model processes `date`, `crop_name`, `market`, `price`, `rainfall`, `temperature`, and `season`.
* **Model Training Pipeline**: Categorical features are label-encoded, dates are parsed into temporal features (year, month, day), and missing values are imputed before passing the transformed tensor into the Random Forest algorithm.

## Future Improvements
* **Mobile App Integration**: Building a native Android/iOS application for easier access in rural areas.
* **Multilingual UI**: Providing interfaces in local languages to support diverse farmer demographics.
* **SMS Alerts**: Integrating Twilio or similar services to send offline price drop/surge alerts.
* **Advanced ML Models**: Exploring Deep Learning (LSTMs) for complex time-series forecasting.
