from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    avatar_url: Optional[str] = None
    created_at: Optional[str] = None

class AuthResponse(BaseModel):
    user: UserOut
    session_token: str
    message: str = "Success"
