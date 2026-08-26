from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.auth.instagram_oauth import InstagramOAuth
from app.config.database import get_db
from app.services.social_account_service import SocialAccountService


router = APIRouter(
    prefix="/auth/instagram",
    tags=["Instagram Authentication"]
)


instagram_oauth = InstagramOAuth()



@router.get("/login")
def instagram_login(user_id: int):

    login_url = instagram_oauth.get_login_url(
        user_id
    )

    return RedirectResponse(login_url)




@router.get("/callback")
def instagram_callback(
    request: Request,
    db: Session = Depends(get_db)
):

    code = request.query_params.get("code")
    user_id = request.query_params.get("state")


    print("========== INSTAGRAM CALLBACK ==========")
    print("CODE:", code)
    print("USER ID:", user_id)
    print("========================================")



    if not code:
        return {
            "status":"failed",
            "message":"Authorization code missing"
        }


    if not user_id:
        return {
            "status":"failed",
            "message":"User ID missing"
        }



    # Get Access Token

    token_response = instagram_oauth.get_access_token(
        code
    )


    print("========== INSTAGRAM TOKEN RESPONSE ==========")
    print(token_response)
    print("==============================================")



    access_token = token_response.get(
        "access_token"
    )



    if not access_token:
        return {
            "status":"failed",
            "message":"Instagram token missing",
            "response":token_response
        }




    # Get Instagram User

    user_info = instagram_oauth.get_user_info(
        access_token
    )


    print("========== INSTAGRAM USER INFO ==========")
    print(user_info)
    print("=========================================")



    if not user_info.get("id"):

        return {
            "status":"failed",
            "message":"Instagram user information missing",
            "data":user_info
        }



    # Save Account

    saved_account = SocialAccountService.save_social_account(
        db=db,
        user_id=int(user_id),
        platform="Instagram",
        access_token=access_token,
        facebook_user_id=user_info.get("id"),
        account_name=user_info.get("username"),
        email=None
    )



    print("========== SAVED ACCOUNT ==========")
    print("NAME:", saved_account.AccountName)
    print("ID:", saved_account.FacebookUserId)
    print("===================================")



    return RedirectResponse(
        "http://localhost:5173/social-connectors"
    )