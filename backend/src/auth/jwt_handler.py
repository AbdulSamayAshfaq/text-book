"""JWT Token Handler"""

import jwt
from datetime import datetime, timedelta
import os
from typing import Optional
import structlog

logger = structlog.get_logger(__name__)


class JWTHandler:
    """Manages JWT token creation and validation"""

    def __init__(self, secret_key: Optional[str] = None):
        """Initialize JWT handler"""
        self.secret_key = secret_key or os.getenv("JWT_SECRET", "your-secret-key")
        self.algorithm = "HS256"

    def create_token(self, user_id: str, expires_in_hours: int = 24) -> str:
        """Create JWT token"""
        try:
            payload = {
                "user_id": user_id,
                "exp": datetime.utcnow() + timedelta(hours=expires_in_hours),
                "iat": datetime.utcnow(),
            }
            token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
            logger.info("token_created", user_id=user_id)
            return token
        except Exception as e:
            logger.error("token_creation_failed", error=str(e))
            raise

    def verify_token(self, token: str) -> dict:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            logger.info("token_verified", user_id=payload.get("user_id"))
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("token_expired")
            raise Exception("Token has expired")
        except jwt.InvalidTokenError:
            logger.warning("invalid_token")
            raise Exception("Invalid token")

    def refresh_token(self, token: str, expires_in_hours: int = 24) -> str:
        """Refresh JWT token"""
        try:
            payload = self.verify_token(token)
            user_id = payload.get("user_id")
            return self.create_token(user_id, expires_in_hours)
        except Exception as e:
            logger.error("token_refresh_failed", error=str(e))
            raise
