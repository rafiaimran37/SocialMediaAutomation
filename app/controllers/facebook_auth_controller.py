from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.auth.facebook_oauth import FacebookOAuth
from app.config.database import get_db
from app.services.social_account_service import SocialAccountService


router = APIRouter(
    prefix="/auth/facebook",
    tags=["Facebook Authentication"]
)


facebook_oauth = FacebookOAuth()


@router.get("/login")
def facebook_login(
    user_id: int,
    client_id: int
):

    login_url = facebook_oauth.get_login_url(
        user_id,
        client_id
    )

    return RedirectResponse(login_url)


@router.get("/callback")
def facebook_callback(
    request: Request,
    db: Session = Depends(get_db)
):

    code = request.query_params.get("code")
    state = request.query_params.get("state")


    if not code:
        return {
            "status": "failed",
            "message": "Authorization code missing"
        }


    if not state:
        return {
            "status": "failed",
            "message": "OAuth state missing"
        }


    try:

        user_id, client_id = state.split(":")

        user_id = int(user_id)
        client_id = int(client_id)

    except ValueError:

        return {
            "status": "failed",
            "message": "Invalid OAuth state"
        }



    # 1. Exchange code for USER access token
    token_response = facebook_oauth.get_access_token(
        code
    )


    user_access_token = token_response.get(
        "access_token"
    )


    if not user_access_token:
        return {
            "status": "failed",
            "message": "Facebook user token not received",
            "response": token_response
        }


    print("USER ACCESS TOKEN RECEIVED")
    print(user_access_token)



    # 2. Get Facebook User Info
    user_info = facebook_oauth.get_user_info(
        user_access_token
    )


    print("====================")
    print("FACEBOOK USER:")
    print(user_info)
    print("====================")



    # 3. Get Facebook Pages
    pages = facebook_oauth.get_pages(
        user_access_token
    )


    print("====================")
    print("FACEBOOK PAGES:")
    print(pages)
    print("====================")



    page_id = None
    page_access_token = None



    if pages.get("data"):

        page = pages["data"][0]


        page_id = page.get(
            "id"
        )


        page_access_token = page.get(
            "access_token"
        )



    print("PAGE ID:")
    print(page_id)


    print("PAGE ACCESS TOKEN:")
    print(page_access_token)



    if not page_id or not page_access_token:

        return {
            "status": "failed",
            "message": "No Facebook Page found. Create a Facebook Page first."
        }



    # 4. Save PAGE TOKEN in database
    SocialAccountService.save_social_account(

        db=db,

        user_id=user_id,

        client_id=client_id,

        platform="Facebook",

        # IMPORTANT:
        # Save PAGE ACCESS TOKEN
        access_token=page_access_token,

        page_id=page_id,

        facebook_user_id=user_info.get(
            "id"
        ),

        account_name=user_info.get(
            "name"
        ),

        email=user_info.get(
            "email"
        )

    )



    print("FACEBOOK ACCOUNT SAVED SUCCESSFULLY")



    return RedirectResponse(
        "http://localhost:5173/social-connectors"
    )