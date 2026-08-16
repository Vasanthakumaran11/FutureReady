import uuid
import datetime
import json
import base64
import httpx
from passlib.context import CryptContext
from typing import Optional, Dict, Any
from bson import ObjectId
from pymongo.errors import PyMongoError

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
        raise RuntimeError("Database connection not ready. Please verify MongoDB status.")
    
    try:
        existing = await users_col.find_one({"email": email.lower()})
    except PyMongoError as e:
        raise RuntimeError(f"Database query error: {str(e)}")

    if existing:
        raise ValueError("A user with this email already exists.")
    
    hashed_pwd = hash_password(password)
    user_doc = {
        "name": name,
        "email": email.lower(),
        "password_hash": hashed_pwd,
        "auth_provider": "local",
        "avatar_url": None,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    try:
        result = await users_col.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
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
    except PyMongoError as e:
        raise RuntimeError(f"Database insertion error: {str(e)}")
    
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
    
    try:
        user_doc = await users_col.find_one({"email": email.lower()})
    except PyMongoError:
        return None

    if not user_doc:
        return None
    
    # If the account was created exclusively with Google OAuth and has no password hash
    if not user_doc.get("password_hash"):
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

async def decode_google_jwt(credential: str) -> Dict[str, Any]:
    """
    Decodes Google ID Token. Attempts Google TokenInfo endpoint first, falling back to base64 payload decode.
    """
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}")
            if resp.status_code == 200:
                return resp.json()
    except Exception:
        pass

    # Fallback to direct JWT payload decoding
    try:
        parts = credential.split(".")
        if len(parts) >= 2:
            padded = parts[1] + "=" * ((4 - len(parts[1]) % 4) % 4)
            decoded_bytes = base64.urlsafe_b64decode(padded.encode("utf-8"))
            return json.loads(decoded_bytes.decode("utf-8"))
    except Exception:
        pass

    return {}

async def authenticate_or_create_google_user(
    credential: Optional[str] = None,
    email: Optional[str] = None,
    name: Optional[str] = None,
    picture: Optional[str] = None
) -> Dict[str, Any]:
    users_col = get_users_collection()
    if users_col is None:
        raise RuntimeError("Database connection not ready. Please verify MongoDB status.")

    user_email = email
    user_name = name
    avatar_url = picture

    if credential:
        jwt_payload = await decode_google_jwt(credential)
        if jwt_payload:
            user_email = jwt_payload.get("email") or user_email
            user_name = jwt_payload.get("name") or jwt_payload.get("given_name") or user_name
            avatar_url = jwt_payload.get("picture") or avatar_url

    if not user_email:
        raise ValueError("Google authentication did not provide a valid email address.")

    user_email = user_email.lower().strip()
    if not user_name:
        user_name = user_email.split("@")[0].capitalize()

    try:
        existing = await users_col.find_one({"email": user_email})
    except PyMongoError as e:
        raise RuntimeError(f"Database query error: {str(e)}")

    if existing:
        user_id = str(existing["_id"])
        # Update avatar if new one is available
        if avatar_url and not existing.get("avatar_url"):
            await users_col.update_one({"_id": existing["_id"]}, {"$set": {"avatar_url": avatar_url}})
            
        return {
            "id": user_id,
            "name": existing.get("name", user_name),
            "email": user_email,
            "avatar_url": existing.get("avatar_url") or avatar_url,
            "created_at": existing.get("created_at")
        }

    # Create new Google user
    user_doc = {
        "name": user_name,
        "email": user_email,
        "password_hash": None,
        "auth_provider": "google",
        "avatar_url": avatar_url,
        "created_at": datetime.datetime.utcnow().isoformat()
    }

    try:
        result = await users_col.insert_one(user_doc)
        user_id = str(result.inserted_id)

        profiles_col = get_profiles_collection()
        if profiles_col is not None:
            await profiles_col.insert_one({
                "user_id": user_id,
                "name": user_name,
                "email": user_email,
                "avatar_url": avatar_url,
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
    except PyMongoError as e:
        raise RuntimeError(f"Database insertion error: {str(e)}")

    return {
        "id": user_id,
        "name": user_name,
        "email": user_email,
        "avatar_url": avatar_url,
        "created_at": user_doc["created_at"]
    }

async def create_session(user_id: str) -> str:
    sessions_col = get_sessions_collection()
    if sessions_col is None:
        raise RuntimeError("Database connection not ready.")
    
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
    
    try:
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
    except PyMongoError:
        return None

async def delete_session(session_token: str):
    sessions_col = get_sessions_collection()
    if sessions_col is not None and session_token:
        try:
            await sessions_col.delete_one({"session_token": session_token})
        except PyMongoError:
            pass
