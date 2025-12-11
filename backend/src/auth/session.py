"""Session Manager"""

from typing import Optional, Dict
import uuid
from datetime import datetime, timedelta
import structlog
from .models import User, Session

logger = structlog.get_logger(__name__)


class SessionManager:
    """Manages user sessions"""

    def __init__(self):
        """Initialize session manager"""
        self.sessions: Dict[str, Session] = {}

    def create_session(self, user: User, token: str, expires_in_hours: int = 24) -> Session:
        """Create new user session"""
        try:
            session_id = str(uuid.uuid4())
            session = Session(
                id=session_id,
                user_id=user.id,
                token=token,
                expires_at=datetime.utcnow() + timedelta(hours=expires_in_hours),
            )
            self.sessions[session_id] = session
            logger.info("session_created", session_id=session_id, user_id=user.id)
            return session
        except Exception as e:
            logger.error("session_creation_failed", error=str(e))
            raise

    def get_session(self, session_id: str) -> Optional[Session]:
        """Get session by ID"""
        session = self.sessions.get(session_id)
        if session and session.expires_at > datetime.utcnow():
            return session
        if session:
            del self.sessions[session_id]
        return None

    def invalidate_session(self, session_id: str):
        """Invalidate/logout session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            logger.info("session_invalidated", session_id=session_id)

    def get_user_sessions(self, user_id: str) -> list:
        """Get all active sessions for user"""
        return [
            s for s in self.sessions.values()
            if s.user_id == user_id and s.expires_at > datetime.utcnow()
        ]
