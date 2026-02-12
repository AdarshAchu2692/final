from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'biddge_db')

print(f"🔄 Connecting to MongoDB: {mongo_url}")
print(f"📊 Using database: {db_name}")

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

app = FastAPI(title="Biddge API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# ============ Helper Functions ============

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        user = await db.users.find_one({"email": email})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        # Convert ObjectId to string
        user["_id"] = str(user["_id"])
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ Pydantic Models ============

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    is_creator: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    name: str
    email: EmailStr
    is_creator: bool
    joined_communities: List[str]
    token: str

class CommunityCreate(BaseModel):
    name: str
    description: str
    category: str
    image_url: Optional[str] = None

class Community(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    name: str
    description: str
    category: str
    creator_id: str
    creator_name: str
    member_count: int = 0
    image_url: Optional[str] = None
    created_at: str

# ============ Auth Endpoints ============

@api_router.post("/auth/register", response_model=UserResponse)
async def register(user_input: UserRegister):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_input.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user document
    hashed_pw = hash_password(user_input.password)
    user_doc = {
        "name": user_input.name,
        "email": user_input.email,
        "password": hashed_pw,
        "is_creator": user_input.is_creator,
        "joined_communities": [],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create access token
    token = create_access_token({"sub": user_input.email})
    
    return UserResponse(
        name=user_input.name,
        email=user_input.email,
        is_creator=user_input.is_creator,
        joined_communities=[],
        token=token
    )

@api_router.post("/auth/login", response_model=UserResponse)
async def login(user_input: UserLogin):
    # Find user
    user = await db.users.find_one({"email": user_input.email})
    if not user or not verify_password(user_input.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    token = create_access_token({"sub": user_input.email})
    
    return UserResponse(
        name=user["name"],
        email=user["email"],
        is_creator=user.get("is_creator", False),
        joined_communities=user.get("joined_communities", []),
        token=token
    )

@api_router.get("/users/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {
        "name": current_user["name"],
        "email": current_user["email"],
        "is_creator": current_user.get("is_creator", False),
        "joined_communities": current_user.get("joined_communities", [])
    }

# ============ Communities Endpoints ============

@api_router.get("/communities")
async def get_communities():
    """
    Get all communities (ALL 8 communities)
    """
    try:
        print("🔍 GET /communities called")
        
        # Check if communities collection exists
        collections = await db.list_collection_names()
        
        if "communities" not in collections:
            print("⚠️ Communities collection does not exist")
            return []
        
        # Get count
        count = await db.communities.count_documents({})
        print(f"📊 Total communities in DB: {count}")
        
        if count == 0:
            print("⚠️ No communities found in database")
            return []
        
        # Get ALL communities (exclude MongoDB _id field)
        cursor = db.communities.find({}, {"_id": 0})
        communities = await cursor.to_list(length=1000)
        
        print(f"✅ Found {len(communities)} communities")
        if len(communities) > 0:
            print(f"📝 Sample community: {communities[0].get('name')}")
        
        return communities
        
    except Exception as e:
        print(f"❌ Error in get_communities: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error fetching communities: {str(e)}")

@api_router.get("/communities/featured")
async def get_featured_communities():
    """
    Get featured communities for home page (6 communities)
    """
    try:
        print("🔍 GET /communities/featured called")
        
        # Check if communities collection exists
        collections = await db.list_collection_names()
        
        if "communities" not in collections:
            print("⚠️ Communities collection does not exist")
            return []
        
        # Get count
        count = await db.communities.count_documents({})
        print(f"📊 Total communities in DB: {count}")
        
        if count == 0:
            print("⚠️ No communities found in database")
            return []
        
        # Get 6 featured communities (most recent by createdAt)
        cursor = db.communities.find({}, {"_id": 0}).sort("createdAt", -1).limit(6)
        communities = await cursor.to_list(length=6)
        
        print(f"✅ Returning {len(communities)} featured communities for home page")
        if len(communities) > 0:
            print(f"📝 Sample featured: {communities[0].get('name')}")
        
        return communities
        
    except Exception as e:
        print(f"❌ Error in get_featured_communities: {str(e)}")
        import traceback
        traceback.print_exc()
        return []  # Return empty array on error, don't crash

@api_router.post("/communities", response_model=Community)
async def create_community(
    community_input: CommunityCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new community (only creators can do this)
    """
    # Check if user is a creator
    if not current_user.get("is_creator", False):
        raise HTTPException(status_code=403, detail="Only creators can create communities")
    
    # Generate unique ID
    community_id = str(uuid.uuid4())
    
    # Create community document
    community_doc = {
        "id": community_id,
        "name": community_input.name,
        "description": community_input.description,
        "category": community_input.category,
        "creator_id": current_user["email"],
        "creator_name": current_user["name"],
        "member_count": 0,
        "image_url": community_input.image_url,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Insert into database
    await db.communities.insert_one(community_doc)
    
    return Community(**community_doc)

@api_router.get("/communities/{community_id}")
async def get_community(community_id: str):
    """
    Get a single community by ID
    """
    community = await db.communities.find_one({"id": community_id}, {"_id": 0})
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    return community

@api_router.post("/communities/{community_id}/join")
async def join_community(
    community_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Join a community
    """
    # Check if community exists
    community = await db.communities.find_one({"id": community_id})
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    user_email = current_user["email"]
    joined_communities = current_user.get("joined_communities", [])
    
    # Check if already joined
    if community_id in joined_communities:
        raise HTTPException(status_code=400, detail="Already joined this community")
    
    # Add community to user's joined list
    await db.users.update_one(
        {"email": user_email},
        {"$push": {"joined_communities": community_id}}
    )
    
    # Increment member count
    await db.communities.update_one(
        {"id": community_id},
        {"$inc": {"member_count": 1}}
    )
    
    return {"message": "Successfully joined community"}

@api_router.post("/communities/{community_id}/leave")
async def leave_community(
    community_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Leave a community
    """
    # Check if community exists
    community = await db.communities.find_one({"id": community_id})
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    user_email = current_user["email"]
    joined_communities = current_user.get("joined_communities", [])
    
    # Check if not a member
    if community_id not in joined_communities:
        raise HTTPException(status_code=400, detail="Not a member of this community")
    
    # Remove community from user's joined list
    await db.users.update_one(
        {"email": user_email},
        {"$pull": {"joined_communities": community_id}}
    )
    
    # Decrement member count
    await db.communities.update_one(
        {"id": community_id},
        {"$inc": {"member_count": -1}}
    )
    
    return {"message": "Successfully left community"}

# ============ Debug Endpoints ============

@api_router.get("/debug/db")
async def debug_database():
    """
    Debug endpoint to check database connection and collections
    """
    try:
        # Get all collections
        collections = await db.list_collection_names()
        
        # Get communities info
        communities_info = {}
        if "communities" in collections:
            count = await db.communities.count_documents({})
            sample = []
            if count > 0:
                cursor = db.communities.find({}, {"_id": 0}).limit(2)
                sample = await cursor.to_list(length=2)
            
            communities_info = {
                "exists": True,
                "count": count,
                "sample": sample
            }
        else:
            communities_info = {
                "exists": False,
                "count": 0,
                "sample": []
            }
        
        # Get users info
        users_info = {}
        if "users" in collections:
            count = await db.users.count_documents({})
            users_info = {
                "exists": True,
                "count": count
            }
        else:
            users_info = {
                "exists": False,
                "count": 0
            }
        
        return {
            "success": True,
            "database": db_name,
            "collections": collections,
            "communities": communities_info,
            "users": users_info
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@api_router.get("/test")
async def test_endpoint():
    """
    Simple test endpoint to verify API is working
    """
    return {
        "status": "ok",
        "message": "Backend is running!",
        "database": db_name,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# ============ App Configuration ============

# Include router
app.include_router(api_router)

# Configure CORS
cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(',')
print(f"🔓 CORS allowed origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ Startup/Shutdown Events ============

@app.on_event("startup")
async def startup_db_client():
    print("✅ Application startup complete")
    print(f"📊 Connected to database: {db_name}")
    
    # Check if communities collection exists and has data
    collections = await db.list_collection_names()
    if "communities" in collections:
        count = await db.communities.count_documents({})
        print(f"📊 Communities in database: {count}")
    else:
        print("⚠️ Communities collection does not exist yet")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    print("🔒 MongoDB connection closed")

@api_router.get("/debug/seed")
async def seed_communities_debug():
    """Seed communities to MongoDB Atlas"""
    import uuid
    from datetime import datetime, timezone
    
    try:
        # Check if communities already exist
        count = await db.communities.count_documents({})
        if count > 0:
            return {"message": f"Database already has {count} communities. No action taken."}
        
        # Your 8 communities
        communities = [
            {
                "id": str(uuid.uuid4()),
                "name": "Career Growth",
                "description": "Connect with professionals and mentors to accelerate your career journey. Share insights, get advice, and grow together.",
                "category": "Career Growth",
                "creator_id": "system@biddge.com",
                "creator_name": "Biddge Team",
                "member_count": 2847,
                "image_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Startup Builders",
                "description": "A vibrant community for founders, makers, and entrepreneurs building the next big thing. Share your journey, learn from others, and find co-founders.",
                "category": "Startup Builders",
                "creator_id": "system@biddge.com",
                "creator_name": "Biddge Team",
                "member_count": 1823,
                "image_url": "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "AI & ML Hub",
                "description": "Explore the world of artificial intelligence and machine learning. From beginners to experts, learn, share, and innovate together.",
                "category": "AI & ML Hub",
                "creator_id": "system@biddge.com",
                "creator_name": "Biddge Team",
                "member_count": 4276,
                "image_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Tech Community",
                "description": "The largest tech community on Biddge. Discuss latest technologies, share projects, and stay updated with industry trends.",
                "category": "Tech Community",
                "creator_id": "system@biddge.com",
                "creator_name": "Biddge Team",
                "member_count": 8542,
                "image_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Fitness & Health",
                "description": "Transform your body and mind. Share workout routines, nutrition tips, and wellness advice with a supportive community.",
                "category": "Fitness & Health",
                "creator_id": "system@biddge.com",
                "creator_name": "Biddge Team",
                "member_count": 3641,
                "image_url": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Design Circle",
                "description": "A creative space for designers to share work, get feedback, and learn new design techniques. All design disciplines welcome.",
                "category": "Design Circle",
                "creator_id": "system@biddge.com",
                "creator_name": "Biddge Team",
                "member_count": 2156,
                "image_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Digital Marketing",
                "description": "Master the art of digital marketing. Learn SEO, social media, content strategy, and analytics from industry experts.",
                "category": "Marketing",
                "creator_id": "system@biddge.com",
                "creator_name": "Biddge Team",
                "member_count": 1892,
                "image_url": "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Personal Finance",
                "description": "Take control of your financial future. Learn about investing, budgeting, and wealth building with our community of finance enthusiasts.",
                "category": "Finance",
                "creator_id": "system@biddge.com",
                "creator_name": "Biddge Team",
                "member_count": 3245,
                "image_url": "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&auto=format&fit=crop",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        
        result = await db.communities.insert_many(communities)
        return {
            "success": True,
            "message": f"✅ Successfully seeded {len(result.inserted_ids)} communities!",
            "count": len(result.inserted_ids)
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# ============ Main Entry Point ============

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Biddge API server...")
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
