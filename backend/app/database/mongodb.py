import os
import re
import certifi
import urllib.parse
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    db = None

db_instance = MongoDB()

def sanitize_mongodb_url(url: str) -> str:
    """
    Safely escapes username and password in MongoDB URI if they contain unescaped special characters like '@'.
    """
    try:
        match = re.match(r'^(mongodb(?:\+srv)?:\/\/)([^:]+):(.+)@([^@]+)$', url)
        if match:
            proto, user, pwd, host_and_query = match.groups()
            encoded_user = urllib.parse.quote_plus(urllib.parse.unquote_plus(user))
            encoded_pwd = urllib.parse.quote_plus(urllib.parse.unquote_plus(pwd))
            return f"{proto}{encoded_user}:{encoded_pwd}@{host_and_query}"
    except Exception:
        pass
    return url

async def connect_to_mongo():
    raw_mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    mongodb_url = sanitize_mongodb_url(raw_mongodb_url)
    db_name = os.getenv("MONGODB_DB_NAME", "futureready")
    
    try:
        is_srv_or_ssl = "mongodb+srv://" in mongodb_url or "ssl=true" in mongodb_url.lower()
        client_kwargs = {
            "serverSelectionTimeoutMS": 20000,
            "connectTimeoutMS": 20000,
            "socketTimeoutMS": 20000,
            "retryWrites": True,
            "retryReads": True,
        }
        
        if is_srv_or_ssl:
            client_kwargs["tls"] = True
            client_kwargs["tlsCAFile"] = certifi.where()
            
        db_instance.client = AsyncIOMotorClient(mongodb_url, **client_kwargs)
        db_instance.db = db_instance.client[db_name]
        
        # Test connection
        await db_instance.client.admin.command('ping')
        print(f"Successfully connected to MongoDB database: {db_name}")
    except Exception as e:
        print(f"Notice: MongoDB connection attempt: {e}")
        print("Tip: If using MongoDB Atlas, ensure your IP is added to Network Access whitelist (or 0.0.0.0/0).")

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("Closed MongoDB connection.")

def get_database():
    return db_instance.db

def get_users_collection():
    if db_instance.db is not None:
        return db_instance.db["users"]
    return None

def get_sessions_collection():
    if db_instance.db is not None:
        return db_instance.db["sessions"]
    return None

def get_profiles_collection():
    if db_instance.db is not None:
        return db_instance.db["profiles"]
    return None

def get_resumes_collection():
    if db_instance.db is not None:
        return db_instance.db["resumes"]
    return None

def get_applications_collection():
    if db_instance.db is not None:
        return db_instance.db["applications"]
    return None

def get_interviews_collection():
    if db_instance.db is not None:
        return db_instance.db["interviews"]
    return None

def get_role_skills_collection():
    if db_instance.db is not None:
        return db_instance.db["role_skills"]
    return None

def get_learning_resources_collection():
    if db_instance.db is not None:
        return db_instance.db["learning_resources"]
    return None

def get_learning_progress_collection():
    if db_instance.db is not None:
        return db_instance.db["learning_progress"]
    return None
