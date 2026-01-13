from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Literal
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Task Models
class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    status: Literal["pending", "completed"] = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TaskCreate(BaseModel):
    title: str

class TaskUpdate(BaseModel):
    status: Literal["pending", "completed"]

# Task endpoints
@api_router.post("/tasks", response_model=Task)
async def create_task(input: TaskCreate):
    """Create a new task"""
    task_dict = input.model_dump()
    task_obj = Task(**task_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = task_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.tasks.insert_one(doc)
    return task_obj

@api_router.get("/tasks", response_model=List[Task])
async def get_tasks():
    """Get all tasks"""
    # Exclude MongoDB's _id field from the query results
    tasks = await db.tasks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for task in tasks:
        if isinstance(task['created_at'], str):
            task['created_at'] = datetime.fromisoformat(task['created_at'])
    
    # Sort by created_at descending (newest first)
    tasks.sort(key=lambda x: x['created_at'], reverse=True)
    
    return tasks

@api_router.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, input: TaskUpdate):
    """Update task status"""
    # Find the task
    task = await db.tasks.find_one({"id": task_id}, {"_id": 0})
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update the status
    await db.tasks.update_one(
        {"id": task_id},
        {"$set": {"status": input.status}}
    )
    
    # Return updated task
    task['status'] = input.status
    if isinstance(task['created_at'], str):
        task['created_at'] = datetime.fromisoformat(task['created_at'])
    
    return Task(**task)

@api_router.get("/")
async def root():
    return {"message": "Task Tracker API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
