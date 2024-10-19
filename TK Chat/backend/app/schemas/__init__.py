from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class SessionCreate(BaseModel):
    pass  # No data needed to create a session

class Session(BaseModel):
    session_id: str
    created_at: datetime
    last_active: datetime
    is_active: int

    class Config:
        orm_mode = True

class Message(BaseModel):
    session_id: str
    role: str
    content: str

class FunctionCall(BaseModel):
    name: str
    arguments: Dict[str, Any]

class ChatResponse(BaseModel):
    session_id: str
    role: str
    content: Optional[str] = None
    function_call: Optional[FunctionCall] = None

class FeedbackCreate(BaseModel):
    session_id: str
    feedback: str
