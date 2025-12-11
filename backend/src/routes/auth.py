"""Authentication Routes"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import uuid
import structlog
from datetime import datetime
from src.auth.models import User, UserRole, LoginRequest, SignupRequest, LoginResponse
from src.auth.jwt_handler import JWTHandler

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
logger = structlog.get_logger(__name__)

# In-memory store (replace with database)
users_db: dict = {}
jwt_handler = JWTHandler()


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Login endpoint"""
    user = users_db.get(request.email)
    if not user or user['password'] != request.password:
        logger.warning("login_failed", email=request.email)
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = jwt_handler.create_token(user['id'])
    user_obj = User(**user)
    
    logger.info("login_success", user_id=user['id'])
    return LoginResponse(
        user=user_obj,
        token=token,
        expires_in=86400
    )


@router.post("/signup", response_model=LoginResponse)
async def signup(request: SignupRequest):
    """Signup endpoint"""
    if request.email in users_db:
        logger.warning("signup_failed", email=request.email, reason="email_exists")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"usr_{uuid.uuid4().hex[:12]}"
    user_data = {
        "id": user_id,
        "email": request.email,
        "name": request.name,
        "password": request.password,  # TODO: Hash password
        "role": UserRole.USER,
        "is_active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    }
    
    users_db[request.email] = user_data
    token = jwt_handler.create_token(user_id)
    user_obj = User(**user_data)
    
    logger.info("signup_success", user_id=user_id, email=request.email)
    return LoginResponse(
        user=user_obj,
        token=token,
        expires_in=86400
    )


@router.post("/refresh")
async def refresh_token(request: dict):
    """Refresh JWT token"""
    try:
        old_token = request.get("token")
        payload = jwt_handler.verify_token(old_token)
        new_token = jwt_handler.create_token(payload["user_id"])
        logger.info("token_refreshed", user_id=payload["user_id"])
        return {"token": new_token, "expires_in": 86400}
    except Exception as e:
        logger.error("token_refresh_failed", error=str(e))
        raise HTTPException(status_code=401, detail="Token refresh failed")


@router.post("/logout")
async def logout(token: str):
    """Logout endpoint"""
    # TODO: Invalidate token in blacklist
    logger.info("logout", token=token[:20] + "...")
    return {"message": "Logged out successfully"}
