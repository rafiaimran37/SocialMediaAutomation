from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.config.database import get_db
from app.schemas.login_schema import LoginRequest
from app.schemas.settings_schema import SettingsProfileUpdateRequest
from app.services.auth_service import AuthService
from app.auth.jwt_handler import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):

    user = AuthService.login(
        db,
        request.email,
        request.password
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    token = create_access_token(
        {
            "user_id": user.Id,
            "sub": user.Email,
            "role": user.Role
        }
    )

    return {
        "message": "Login Successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": user.FullName,
            "email": user.Email,
            "role": user.Role
        }
    }


@router.get("/me")
def get_current_profile(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):

    user = AuthService.get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "fullName": user.FullName,
        "email": user.Email,
    }


@router.put("/me")
def update_current_profile(
    request: SettingsProfileUpdateRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):

    user = AuthService.update_full_name(db, user_id, request.fullName)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "Profile updated successfully",
        "fullName": user.FullName,
        "email": user.Email,
    }