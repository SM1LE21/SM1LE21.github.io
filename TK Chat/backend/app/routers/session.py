# This file contains the API endpoints for session management.
# Sessions are used to keep track of the user's conversation history and rate limiting.
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas
import uuid
from app.utils.logger import logger

router = APIRouter(
    prefix="/session",
    tags=["session"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/initialize_session", response_model=schemas.Session)
def initialize_session(db: Session = Depends(get_db)):
    session_id = str(uuid.uuid4())
    logger.info(f"Session {session_id}: Initializing new session.")
    
    db_session = models.Session(session_id=session_id)
    logger.info(f"Session {session_id}: Saving session to database.")

    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session
