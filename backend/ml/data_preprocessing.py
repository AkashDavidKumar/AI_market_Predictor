import pandas as pd
from sklearn.preprocessing import LabelEncoder
import joblib

class DataPreprocessor:
    def __init__(self):
        self.label_encoders = {}
        
    def preprocess_data(self, df: pd.DataFrame, training=True):
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            df['month'] = df['date'].dt.month
            df['year'] = df['date'].dt.year
            df = df.drop('date', axis=1)
            
        categorical_cols = ['crop_name', 'market', 'season']
        
        for col in categorical_cols:
            if col in df.columns:
                if training:
                    le = LabelEncoder()
                    df[col] = le.fit_transform(df[col].astype(str))
                    self.label_encoders[col] = le
                else:
                    le = self.label_encoders.get(col)
                    if le:
                        known_classes = set(le.classes_)
                        df[col] = df[col].apply(lambda x: x if x in known_classes else le.classes_[0])
                        df[col] = le.transform(df[col].astype(str))
                        
        numeric_cols = ['rainfall', 'temperature']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = df[col].fillna(df[col].mean() if training else 0)
                
        return df

    def save_encoders(self, filepath="model/encoders.joblib"):
        joblib.dump(self.label_encoders, filepath)
        
    def load_encoders(self, filepath="model/encoders.joblib"):
        self.label_encoders = joblib.load(filepath)
