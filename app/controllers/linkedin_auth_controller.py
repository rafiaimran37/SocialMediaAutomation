from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.auth.linkedin_oauth import LinkedInOAuth
from app.config.database import get_db
from app.services.social_account_service import SocialAccountService


router = APIRouter(
    prefix="/auth/linkedin",
    tags=["LinkedIn Authentication"]
)


linkedin_oauth = LinkedInOAuth()


@router.get("/login")
def linkedin_login(user_id: int):

    login_url = linkedin_oauth.get_login_url(
        user_id
    )

    return RedirectResponse(login_url)


@router.get("/callback")
def linkedin_callback(
    request: Request,
    db: Session = Depends(get_db)
):

    code = request.query_params.get("code")
    user_id = request.query_params.get("state")

    if not code:
        return {
            "status": "failed",
            "message": "Authorization code missing"
        }

    if not user_id:
        return {
            "status": "failed",
            "message": "User ID missing"
        }

    token_response = linkedin_oauth.get_access_token(
        code
    )

    access_token = token_response.get(
        "access_token"
    )

    if not access_token:
        return {
            "status": "failed",
            "message": "LinkedIn access token not received",
            "linkedin_response": token_response
        }

    user_info = linkedin_oauth.get_user_info(
        access_token
    )

    print(user_info)

    SocialAccountService.save_social_account(
        db=db,
        user_id=int(user_id),
        platform="LinkedIn",
        access_token=access_token,
        facebook_user_id=user_info.get("sub"),
        account_name=user_info.get("name"),
        email=user_info.get("email")
    )

    return RedirectResponse(
        url="http://localhost:5173/social-connectors",
        status_code=302
    )