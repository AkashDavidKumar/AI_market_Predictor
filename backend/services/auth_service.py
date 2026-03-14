import datetime
from database.db_connection import users_collection
from utils.auth_utils import hash_password, verify_password
from flask_jwt_extended import create_access_token

class AuthService:
    @staticmethod
    def register_user(name, email, password, role='farmer', language='en'):
        if users_collection.find_one({"email": email}):
            return {"error": "Email already exists"}, 400
            
        hashed_password = hash_password(password)
        new_user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": role,
            "language": language,
            "created_at": datetime.datetime.utcnow()
        }
        
        try:
            print(f"[DEBUG] Attempting to register user with email: {email}")
            print(f"[DEBUG] User data being inserted: {{'name': '{name}', 'email': '{email}', 'role': '{role}', 'language': '{language}'}}")
            
            result = users_collection.insert_one(new_user)
            
            print(f"[DEBUG] MongoDB insertion successful. inserted_id: {str(result.inserted_id)}")
            return {"message": "User registered successfully", "user_id": str(result.inserted_id)}, 201
            
        except Exception as e:
            print(f"[ERROR] Failed to insert user into MongoDB: {e}")
            return {"error": "Internal server error during registration"}, 500
        
    @staticmethod
    def login_user(email, password):
        user = users_collection.find_one({"email": email})
        
        if not user or not verify_password(password, user.get("password")):
            return {"error": "Invalid email or password"}, 401
            
        access_token = create_access_token(
            identity=str(user["_id"]),
            additional_claims={"role": user.get("role", "farmer")},
            expires_delta=datetime.timedelta(days=1)
        )
        
        return {
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "id": str(user["_id"]),
                "name": user.get("name"),
                "email": user.get("email"),
                "role": user.get("role")
            }
        }, 200
