"""MongoDB database connection and models"""
import os
from typing import Optional
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "shopsage")

if not MONGODB_URI or "YOUR_PASSWORD_HERE" in MONGODB_URI:
    print("⚠️ MongoDB not configured - running in fallback mode")
    print("   Set MONGODB_URI in .env file to enable database features")
    raise ValueError("MONGODB_NOT_CONFIGURED")

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB_NAME]

# Collections
users_collection = db["users"]
carts_collection = db["carts"]
orders_collection = db["orders"]

# Create indexes
users_collection.create_index("email", unique=True)
users_collection.create_index("username", unique=True)
carts_collection.create_index("user_id")
orders_collection.create_index("user_id")
orders_collection.create_index("created_at")

print(f"✅ Connected to MongoDB: {MONGODB_DB_NAME}")


class User:
    """User model"""
    
    @staticmethod
    def create(email: str, username: str, hashed_password: str, full_name: str = None, phone: str = None, address: str = None) -> dict:
        """Create a new user"""
        user = {
            "email": email,
            "username": username,
            "password": hashed_password,
            "full_name": full_name or username,
            "phone": phone or "",
            "address": address or "",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = users_collection.insert_one(user)
        user["_id"] = str(result.inserted_id)
        return user
    
    @staticmethod
    def find_by_email(email: str) -> Optional[dict]:
        """Find user by email"""
        user = users_collection.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
        return user
    
    @staticmethod
    def find_by_username(username: str) -> Optional[dict]:
        """Find user by username"""
        user = users_collection.find_one({"username": username})
        if user:
            user["_id"] = str(user["_id"])
        return user
    
    @staticmethod
    def find_by_id(user_id: str) -> Optional[dict]:
        """Find user by ID"""
        from bson import ObjectId
        try:
            user = users_collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user["_id"] = str(user["_id"])
            return user
        except:
            return None
    
    @staticmethod
    def update_profile(user_id: str, updates: dict) -> Optional[dict]:
        """Update user profile fields"""
        from bson import ObjectId
        try:
            # Only allow specific fields to be updated
            allowed_fields = ["full_name", "email", "phone", "address"]
            filtered_updates = {k: v for k, v in updates.items() if k in allowed_fields}
            
            if not filtered_updates:
                return None
            
            filtered_updates["updated_at"] = datetime.utcnow()
            
            result = users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": filtered_updates}
            )
            
            if result.modified_count > 0:
                return User.find_by_id(user_id)
            return None
        except:
            return None


class Cart:
    """Cart model"""
    
    @staticmethod
    def get_or_create(user_id: str) -> dict:
        """Get user's cart or create if doesn't exist"""
        cart = carts_collection.find_one({"user_id": user_id})
        if not cart:
            cart = {
                "user_id": user_id,
                "items": [],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            result = carts_collection.insert_one(cart)
            cart["_id"] = str(result.inserted_id)
        else:
            cart["_id"] = str(cart["_id"])
        return cart
    
    @staticmethod
    def add_item(user_id: str, item: dict) -> dict:
        """Add item to cart"""
        cart = Cart.get_or_create(user_id)
        
        # Check if item already exists
        existing_item = None
        for cart_item in cart["items"]:
            if cart_item["id"] == item["id"]:
                existing_item = cart_item
                break
        
        if existing_item:
            # Update quantity
            carts_collection.update_one(
                {"user_id": user_id, "items.id": item["id"]},
                {
                    "$inc": {"items.$.quantity": item.get("quantity", 1)},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
        else:
            # Add new item
            carts_collection.update_one(
                {"user_id": user_id},
                {
                    "$push": {"items": item},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
        
        return Cart.get_or_create(user_id)
    
    @staticmethod
    def remove_item(user_id: str, product_id: str) -> dict:
        """Remove item from cart"""
        carts_collection.update_one(
            {"user_id": user_id},
            {
                "$pull": {"items": {"id": product_id}},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        return Cart.get_or_create(user_id)
    
    @staticmethod
    def update_quantity(user_id: str, product_id: str, quantity: int) -> dict:
        """Update item quantity"""
        if quantity <= 0:
            return Cart.remove_item(user_id, product_id)
        
        carts_collection.update_one(
            {"user_id": user_id, "items.id": product_id},
            {
                "$set": {
                    "items.$.quantity": quantity,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return Cart.get_or_create(user_id)
    
    @staticmethod
    def clear(user_id: str):
        """Clear all items from cart"""
        carts_collection.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "items": [],
                    "updated_at": datetime.utcnow()
                }
            }
        )


class Order:
    """Order model"""
    
    @staticmethod
    def create(user_id: str, items: list, shipping_info: dict, total: float) -> dict:
        """Create a new order"""
        order = {
            "user_id": user_id,
            "items": items,
            "shipping_info": shipping_info,
            "total": total,
            "status": "completed",
            "created_at": datetime.utcnow()
        }
        result = orders_collection.insert_one(order)
        order["_id"] = str(result.inserted_id)
        return order
    
    @staticmethod
    def get_user_orders(user_id: str) -> list:
        """Get all orders for a user"""
        orders = list(orders_collection.find({"user_id": user_id}).sort("created_at", -1))
        for order in orders:
            order["_id"] = str(order["_id"])
        return orders
