from typing import List, Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime

class TaskBase(SQLModel):
    title: str
    description: Optional[str] = ""
    status: str = "todo"
    priority: str = "medium"
    tags: List[str] = []
    deadline: Optional[str] = None

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
class TaskCreate(TaskBase):
    pass

class TaskPublic(TaskBase):
    id: int
    created_at: datetime