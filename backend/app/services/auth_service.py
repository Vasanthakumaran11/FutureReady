import uuid
import datetime
from passlib.context import CryptContext
from typing import Optional, Dict, Any
from bson import ObjectId

from ..database.mongodb import (
    get_users_collection,
    get_sessions_collection,
    get_profiles_collection
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

async def create_user(name: str, email: str, password: str) -> Dict[str, Any]:
    users_col = get_users_collection()
    if users_col is None:
        raise RuntimeError("Database not connected")
    
    # Check if user already exists
    existing = await users_col.find_one({"email": email.lower()})
    if existing:
        raise ValueError("A user with this email already exists")
    
    hashed_pwd = hash_password(password)
    user_doc = {
        "name": name,
        "email": email.lower(),
        "password_hash": hashed_pwd,
        "avatar_url": None,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    result = await users_col.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Initialize an empty profile for the new user (no default mock data)
    profiles_col = get_profiles_collection()
    if profiles_col is not None:
        await profiles_col.insert_one({
            "user_id": user_id,
            "name": name,
            "email": email.lower(),
            "phone": "",
            "location": "",
            "workMode": "Hybrid",
            "yearsExperience": "0-1",
            "targetRoles": {"major": "", "secondary": ""},
            "skills": [],
            "education": [],
            "experience": [],
            "projects": [],
            "certifications": [],
            "updated_at": datetime.datetime.utcnow().isoformat()
        })
    
    return {
        "id": user_id,
        "name": name,
        "email": email.lower(),
        "avatar_url": None,
        "created_at": user_doc["created_at"]
    }

async def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    users_col = get_users_collection()
    if users_col is None:
        return None
    
    user_doc = await users_col.find_one({"email": email.lower()})
    if not user_doc:
        return None
    
    if not verify_password(password, user_doc.get("password_hash", "")):
        return None
    
    return {
        "id": str(user_doc["_id"]),
        "name": user_doc.get("name", ""),
        "email": user_doc.get("email", ""),
        "avatar_url": user_doc.get("avatar_url"),
        "created_at": user_doc.get("created_at")
    }

async def create_session(user_id: str) -> str:
    sessions_col = get_sessions_collection()
    if sessions_col is None:
        raise RuntimeError("Database not connected")
    
    session_token = str(uuid.uuid4())
    session_doc = {
        "session_token": session_token,
        "user_id": user_id,
        "created_at": datetime.datetime.utcnow(),
        "expires_at": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    
    await sessions_col.insert_one(session_doc)
    return session_token

async def get_user_from_session(session_token: str) -> Optional[Dict[str, Any]]:
    if not session_token:
        return None
    
    sessions_col = get_sessions_collection()
    users_col = get_users_collection()
    if sessions_col is None or users_col is None:
        return None
    
    session_doc = await sessions_col.find_one({
        "session_token": session_token,
        "expires_at": {"$gt": datetime.datetime.utcnow()}
    })
    
    if not session_doc:
        return None
    
    user_id = session_doc.get("user_id")
    try:
        user_doc = await users_col.find_one({"_id": ObjectId(user_id)})
    except Exception:
        user_doc = await users_col.find_one({"_id": user_id})
        
    if not user_doc:
        return None
    
    return {
        "id": str(user_doc["_id"]),
        "name": user_doc.get("name", ""),
        "email": user_doc.get("email", ""),
        "avatar_url": user_doc.get("avatar_url"),
        "created_at": user_doc.get("created_at")
    }

async def delete_session(session_token: str):
    sessions_col = get_sessions_collection()
    if sessions_col is not None and session_token:
        await sessions_col.delete_one({"session_token": session_token})
