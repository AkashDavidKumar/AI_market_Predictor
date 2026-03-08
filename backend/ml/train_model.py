import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml.data_preprocessing import DataPreprocessor

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DATASET = os.path.join(BASE_DIR, "dataset", "market_data.csv")
DEFAULT_MODEL = os.path.join(BASE_DIR, "model", "model.joblib")
DEFAULT_ENCODER = os.path.join(BASE_DIR, "model", "encoders.joblib")

def train_model(dataset_path=DEFAULT_DATASET, model_path=DEFAULT_MODEL, encoder_path=DEFAULT_ENCODER):
    print(f"Loading dataset from {dataset_path}...")
    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}. Please upload a dataset first.")
        return False
        
    df = pd.read_csv(dataset_path)
    
    print("Preprocessing data...")
    preprocessor = DataPreprocessor()
    df_processed = preprocessor.preprocess_data(df, training=True)
    
    os.makedirs(os.path.dirname(encoder_path), exist_ok=True)
    preprocessor.save_encoders(encoder_path)
    
    if 'price' not in df_processed.columns:
        print("Error: 'price' column not found in dataset.")
        return False
        
    X = df_processed.drop('price', axis=1)
    y = df_processed['price']
    
    # Needs enough samples, fallback to simple split for small datasets
    if len(X) > 5:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    else:
        X_train, X_test, y_train, y_test = X, X, y, y
        
    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    print(f"Model Evaluation - MSE: {mse:.2f}, R2 Score: {r2:.2f}")
    
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    print(f"Model saved successfully to {model_path}")
    
    return True

if __name__ == "__main__":
    train_model()
