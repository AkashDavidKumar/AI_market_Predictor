from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
import os
from werkzeug.utils import secure_filename
from ml.train_model import train_model
from ml.predictor import predictor_instance

admin_bp = Blueprint('admin_bp', __name__)

def admin_required():
    def wrapper(fn):
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims.get('role') != 'admin':
                return jsonify({"error": "Admin privileges required"}), 403
            return fn(*args, **kwargs)
        decorator.__name__ = fn.__name__
        return decorator
    return wrapper

@admin_bp.route('/upload-dataset', methods=['POST'])
def upload_dataset():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and file.filename.endswith('.csv'):
        filename = secure_filename(file.filename)
        save_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dataset', 'market_data.csv')
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        file.save(save_path)
        
        # Trigger retraining
        success = train_model(
            dataset_path=save_path, 
            model_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'model.joblib'),
            encoder_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'encoders.joblib')
        )
        
        if success:
            # Reload predictor
            predictor_instance.load_model()
            return jsonify({"message": "Dataset uploaded and model retrained successfully"}), 200
        else:
            return jsonify({"error": "Failed to train model"}), 500
            
    return jsonify({"error": "Invalid file format, please upload CSV"}), 400
