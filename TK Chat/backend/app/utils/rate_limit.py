from fastapi import HTTPException
from sqlalchemy.orm import Session
from app import models
import datetime
from app.config import MAX_MESSAGES_PER_MINUTE


def is_rate_limited(session_id: str, db: Session):
    one_minute_ago = datetime.datetime.utcnow() - datetime.timedelta(minutes=1)
    message_count = db.query(models.Message).filter(
        models.Message.session_id == session_id,
        models.Message.timestamp >= one_minute_ago
    ).count()
    if message_count >= MAX_MESSAGES_PER_MINUTE:
        return True
    return False
