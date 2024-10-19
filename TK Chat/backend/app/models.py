# Models for the database
from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database import Base
import datetime

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_active = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Integer, default=1)  # 1 for active, 0 for expired

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    role = Column(String)  # 'user' or 'assistant'
    content = Column(Text)
    function_call = Column(Text, nullable=True) 
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    feedback = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
