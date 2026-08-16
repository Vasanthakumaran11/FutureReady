from fastapi import APIRouter, HTTPException, status, Response, Header, Depends
from typing import Optional

from ..schemas.auth import UserRegister, UserLogin, AuthResponse, UserOut
from ..services.auth_service import (
    create_user,
    authenticate_user,
    create_session,
    delete_session
)
from .deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=AuthResponse)
async def register(payload: UserRegister, response: Response):
    try:
        user = await create_user(payload.name, payload.email, payload.password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Registration failed.")
        
    session_token = await create_session(user["id"])
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        max_age=7 * 86400,
        samesite="lax"
    )
    
    return {
        "user": user,
        "session_token": session_token,
        "message": "Account created successfully."
    }

@router.post("/login", response_model=AuthResponse)
async def login(payload: UserLogin, response: Response):
    user = await authenticate_user(payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    session_token = await create_session(user["id"])
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        max_age=7 * 86400,
        samesite="lax"
    )
    
    return {
        "user": user,
        "session_token": session_token,
        "message": "Signed in successfully."
    }

@router.get("/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.post("/logout")
async def logout(
    response: Response,
    x_session_token: Optional[str] = Header(None, alias="X-Session-Token")
):
    if x_session_token:
        await delete_session(x_session_token)
    response.delete_cookie("session_token")
    return {"message": "Signed out successfully."}
