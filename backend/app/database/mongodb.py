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
        if "mongodb+srv://" in mongodb_url or "ssl=true" in mongodb_url.lower():
            db_instance.client = AsyncIOMotorClient(
                mongodb_url,
                tlsCAFile=certifi.where(),
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
                socketTimeoutMS=5000
            )
        else:
            db_instance.client = AsyncIOMotorClient(
                mongodb_url,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
                socketTimeoutMS=5000
            )
        
        db_instance.db = db_instance.client[db_name]
        await db_instance.client.admin.command('ping')
        print(f"Successfully connected to MongoDB Atlas database: {db_name}")
    except Exception as e:
        print(f"Notice: MongoDB Atlas connection pending: {e}")
        print("Tip: If you see TLS/handshake errors, ensure your IP address (or 0.0.0.0/0) is added in Atlas Network Access.")

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
