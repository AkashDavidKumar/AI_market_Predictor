import pytest
import pandas as pd
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml.data_preprocessing import DataPreprocessor

def test_data_preprocessor():
    df = pd.DataFrame([{
        'date': '2026-01-01',
        'crop_name': 'tomato',
        'market': 'salem',
        'price': 30.0,
        'rainfall': 10.0,
        'temperature': 28.0,
        'season': 'Rabi'
    }])
    
    preprocessor = DataPreprocessor()
    processed_df = preprocessor.preprocess_data(df, training=True)
    
    assert 'month' in processed_df.columns
    assert 'year' in processed_df.columns
    assert 'date' not in processed_df.columns
    assert processed_df['crop_name'].iloc[0] == 0  # Label encoded
