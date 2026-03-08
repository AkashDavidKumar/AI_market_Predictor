import pandas as pd
import joblib
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml.data_preprocessing import DataPreprocessor

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_MODEL = os.path.join(BASE_DIR, "model", "model.joblib")
DEFAULT_ENCODER = os.path.join(BASE_DIR, "model", "encoders.joblib")

class PricePredictor:
    def __init__(self, model_path=DEFAULT_MODEL, encoder_path=DEFAULT_ENCODER):
        self.model_path = model_path
        self.encoder_path = encoder_path
        self.model = None
        self.preprocessor = None
        self.load_model()
        
    def load_model(self):
        if os.path.exists(self.model_path) and os.path.exists(self.encoder_path):
            self.model = joblib.load(self.model_path)
            self.preprocessor = DataPreprocessor()
            self.preprocessor.load_encoders(self.encoder_path)
            return True
        return False
        
    def predict(self, crop_name, market, date, rainfall=0, temperature=0, season='Kharif'):
        if not self.model or not self.preprocessor:
            if not self.load_model():
                raise Exception("Model or encoders not found. Please train the model first.")
                
        input_data = pd.DataFrame([{
            'date': date,
            'crop_name': crop_name,
            'market': market,
            'rainfall': rainfall,
            'temperature': temperature,
            'season': season
        }])
        
        processed_data = self.preprocessor.preprocess_data(input_data, training=False)
        
        # Ensure column order matches training data
        training_features = self.model.feature_names_in_ if hasattr(self.model, 'feature_names_in_') else None
        if training_features is not None:
             processed_data = processed_data.reindex(columns=training_features, fill_value=0)

        prediction = self.model.predict(processed_data)
        return float(prediction[0])

# Singleton instance for the app to use
predictor_instance = PricePredictor()
