"""Auth Models"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    """User roles"""
    ADMIN = "admin"
    USER = "user"
    HR = "hr"
    EMPLOYEE = "employee"


class User(BaseModel):
    """User model"""
    id: str
    email: str
    name: str
    password_hash: str
    role: UserRole = UserRole.USER
    is_active: bool = True
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()


class Session(BaseModel):
    """Session model"""
    id: str
    user_id: str
    token: str
    expires_at: datetime
    created_at: datetime = datetime.now()


class LoginRequest(BaseModel):
    """Login request"""
    email: str
    password: str


class LoginResponse(BaseModel):
    """Login response"""
    user: User
    token: str
    expires_in: int


class SignupRequest(BaseModel):
    """Signup request"""
    email: str
    name: str
    password: str


class SignupResponse(BaseModel):
    """Signup response"""
    user: User
    token: str
