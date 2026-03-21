import datetime
from flask import Flask
from flask_jwt_extended import JWTManager, create_access_token
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key_here')
jwt = JWTManager(app)

with app.app_context():
    # Use a dummy ID or an existing one from find_user.py if available
    # I saw an ID like '69b58b0b9ad0df4599e' in the previous truncated output
    # Let's just use a string ID
    token = create_access_token(identity="test_user_id", expires_delta=datetime.timedelta(days=1))
    print(token)
