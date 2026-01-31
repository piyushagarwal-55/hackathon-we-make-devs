"""Test MongoDB connection"""
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
print(f"MongoDB URI: {MONGODB_URI}")

try:
    from pymongo import MongoClient
    
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    
    # Test connection
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB!")
    
    # List databases
    dbs = client.list_database_names()
    print(f"Available databases: {dbs}")
    
except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")
    import traceback
    traceback.print_exc()
