from models.user_model import User
from database.db_connection import db
from utils.auth_utils import hash_password, verify_password
from flask_jwt_extended import create_access_token
import datetime

class AuthService:
    @staticmethod
    def register_user(name, email, password, role='farmer', language='en'):
        if User.query.filter_by(email=email).first():
            return {"error": "Email already exists"}, 400
            
        hashed_password = hash_password(password)
        new_user = User(
            name=name,
            email=email,
            password=hashed_password,
            role=role,
            language=language
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return {"message": "User registered successfully", "user_id": new_user.id}, 201
        
    @staticmethod
    def login_user(email, password):
        user = User.query.filter_by(email=email).first()
        if not user or not verify_password(password, user.password):
            return {"error": "Invalid email or password"}, 401
            
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"role": user.role},
            expires_delta=datetime.timedelta(days=1)
        )
        
        return {
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }, 200
