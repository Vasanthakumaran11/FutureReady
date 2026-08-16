from fastapi import Header, HTTPException, status, Cookie, Depends
from typing import Optional, Dict, Any
from ..services.auth_service import get_user_from_session

async def get_current_user(
    x_session_token: Optional[str] = Header(None, alias="X-Session-Token"),
    session_token: Optional[str] = Cookie(None)
) -> Dict[str, Any]:
    token = x_session_token or session_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session authentication required."
        )
        
    user = await get_user_from_session(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session. Please sign in again."
        )
        
    return user
