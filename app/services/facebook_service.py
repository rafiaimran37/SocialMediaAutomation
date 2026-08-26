import requests

from sqlalchemy.orm import Session

from app.config.settings import (
    PUBLIC_MEDIA_BASE_URL
)

from app.models.social_account import SocialAccount
from app.models.published_post import PublishedPost


class FacebookService:

    @staticmethod
    def create_post(

        db: Session,

        user_id: int,

        client_id: int,

        message: str,

        media_path=None

    ):

        print(
            "Facebook Service Started"
        )

        print(
            "User ID:",
            user_id
        )

        print(
            "Client ID:",
            client_id
        )

        # ==========================================
        # FIND CLIENT FACEBOOK ACCOUNT
        # ==========================================

        account = (

            db.query(
                SocialAccount
            )

            .filter(

                SocialAccount.UserId
                == user_id,

                SocialAccount.ClientId
                == client_id,

                SocialAccount.Platform
                == "Facebook"

            )

            .first()

        )

        if not account:

            print(
                "Facebook account not connected for client:",
                client_id
            )

            return {

                "status": "failed",

                "message":
                "Facebook account not connected for this store"

            }

        page_id = account.PageId

        page_token = account.AccessToken

        print(
            "Facebook Page:",
            page_id
        )

        # ==========================================
        # MEDIA URL
        # ==========================================

        media_url = None

        if media_path:

            media_url = (
                PUBLIC_MEDIA_BASE_URL
                + media_path
            )

        # ==========================================
        # VIDEO
        # ==========================================

        if (

            media_path

            and media_path.lower().endswith(

                (
                    ".mp4",
                    ".mov"
                )

            )

        ):

            print(
                "Publishing Facebook Video"
            )

            url = (
                f"https://graph.facebook.com/v19.0/"
                f"{page_id}/videos"
            )

            payload = {

                "description": message,

                "file_url": media_url,

                "access_token": page_token

            }

        # ==========================================
        # IMAGE
        # ==========================================

        elif (

            media_path

            and media_path.lower().endswith(

                (
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".webp"
                )

            )

        ):

            print(
                "Publishing Facebook Image"
            )

            url = (
                f"https://graph.facebook.com/v19.0/"
                f"{page_id}/photos"
            )

            payload = {

                "caption": message,

                "url": media_url,

                "access_token": page_token

            }

        # ==========================================
        # TEXT
        # ==========================================

        else:

            print(
                "Publishing Facebook Text"
            )

            url = (
                f"https://graph.facebook.com/v19.0/"
                f"{page_id}/feed"
            )

            payload = {

                "message": message,

                "access_token": page_token

            }

        # ==========================================
        # REQUEST
        # ==========================================

        response = requests.post(

            url,

            data=payload
        )

        result = response.json()

        print(
            "FACEBOOK RESPONSE:",
            result
        )

        if response.status_code != 200:

            return {

                "status": "failed",

                "facebook_error":
                result

            }

        # ==========================================
        # PUBLISHED HISTORY
        # ==========================================

        published_post = PublishedPost(

            UserId=user_id,

            Platform="Facebook",

            Message=message,

            PostId=(
                result.get("post_id")
                or result.get("id")
            ),

            Status="Published"

        )

        db.add(
            published_post
        )

        db.commit()

        db.refresh(
            published_post
        )

        return {

            "status": "success",

            "platform": "Facebook",

            "post_id": (
                result.get("post_id")
                or result.get("id")
            )

        }