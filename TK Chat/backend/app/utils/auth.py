import datetime
from sqlalchemy.orm import Session
from app import models

SESSION_TIMEOUT_MINUTES = 30

def is_session_active(session_id: str, db: Session):
    db_session = db.query(models.Session).filter(models.Session.session_id == session_id).first()
    if db_session and db_session.is_active:
        now = datetime.datetime.utcnow()
        if (now - db_session.last_active).total_seconds() < SESSION_TIMEOUT_MINUTES * 60:
            # Update last_active
            db_session.last_active = now
            db.commit()
            return True
        else:
            # Session expired
            db_session.is_active = 0
            db.commit()
    return False
