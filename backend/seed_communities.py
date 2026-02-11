import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_communities():
    # Connect to MongoDB
    mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.getenv('DB_NAME', 'biddge_db')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Check if communities already exist
    existing_count = await db.communities.count_documents({})
    if existing_count > 0:
        print(f"⚠️ Database already has {existing_count} communities.")
        overwrite = input("Do you want to overwrite? (y/n): ")
        if overwrite.lower() != 'y':
            print("❌ Seeding cancelled")
            return
        else:
            await db.communities.delete_many({})
            print("🗑️ Cleared existing communities")
    
    # ALL 8 COMMUNITIES with proper IDs and image_url fields
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
    
    # Insert all communities
    result = await db.communities.insert_many(communities)
    print(f"✅ Successfully seeded {len(result.inserted_ids)} communities into '{db_name}'!")
    
    # Verify
    count = await db.communities.count_documents({})
    print(f"📊 Total communities in '{db_name}': {count}")
    
    # Show all communities
    cursor = db.communities.find({}, {"_id": 0})
    all_comms = await cursor.to_list(length=10)
    print("\n📝 Communities in database:")
    for comm in all_comms:
        print(f"   - {comm['name']} ({comm['member_count']} members)")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_communities())