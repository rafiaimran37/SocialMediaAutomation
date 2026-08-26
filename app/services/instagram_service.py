import time
import requests

from sqlalchemy.orm import Session

from app.config.settings import (
    PUBLIC_MEDIA_BASE_URL
)

from app.models.social_account import SocialAccount
from app.models.published_post import PublishedPost


class InstagramService:

    @staticmethod
    def wait_for_media_ready(
        creation_id,
        access_token
    ):

        print(
            "Checking Instagram media processing..."
        )

        status_url = (
            f"https://graph.instagram.com/"
            f"{creation_id}"
        )

        for attempt in range(12):

            response = requests.get(

                status_url,

                params={

                    "fields":
                    "status_code",

                    "access_token":
                    access_token

                }

            )

            result = response.json()

            print(
                "MEDIA STATUS:",
                result
            )

            if (
                result.get(
                    "status_code"
                )
                == "FINISHED"
            ):

                print(
                    "Media processing completed"
                )

                return True

            if (
                result.get(
                    "status_code"
                )
                == "ERROR"
            ):

                print(
                    "Instagram media processing failed"
                )

                return False

            time.sleep(10)

        print(
            "Instagram processing timeout"
        )

        return False

    @staticmethod
    def create_post(

        db: Session,

        user_id: int,

        client_id: int,

        message: str,

        media_path=None

    ):

        print(
            "Instagram Service Started"
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
        # FIND CLIENT INSTAGRAM ACCOUNT
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
                == "Instagram"

            )

            .first()

        )

        if not account:

            print(
                "Instagram account not connected for client:",
                client_id
            )

            return {

                "status": "failed",

                "message":
                "Instagram account not connected for this store"

            }

        instagram_id = (
            account.FacebookUserId
        )

        access_token = (
            account.AccessToken
        )

        print(
            "Instagram ID:",
            instagram_id
        )

        if not access_token:

            return {

                "status": "failed",

                "message":
                "Instagram access token missing"

            }

        if not instagram_id:

            return {

                "status": "failed",

                "message":
                "Instagram account ID missing"

            }

        # ==========================================
        # INSTAGRAM REQUIRES MEDIA
        # ==========================================

        if not media_path:

            return {

                "status": "failed",

                "message":
                "Instagram requires media"

            }

        media_url = (
            PUBLIC_MEDIA_BASE_URL
            + media_path
        )

        print(
            "MEDIA URL:",
            media_url
        )

        container_url = (
            f"https://graph.instagram.com/"
            f"{instagram_id}/media"
        )

        # ==========================================
        # IMAGE
        # ==========================================

        if media_path.lower().endswith(

            (
                ".jpg",
                ".jpeg",
                ".png",
                ".webp"
            )

        ):

            container_data = {

                "image_url":
                media_url,

                "caption":
                message,

                "access_token":
                access_token

            }

        # ==========================================
        # REEL
        # ==========================================

        elif media_path.lower().endswith(

            (
                ".mp4",
                ".mov"
            )

        ):

            container_data = {

                "media_type":
                "REELS",

                "video_url":
                media_url,

                "caption":
                message,

                "access_token":
                access_token

            }

        else:

            return {

                "status": "failed",

                "message":
                "Unsupported media format"

            }

        # ==========================================
        # CREATE CONTAINER
        # ==========================================

        print(
            "Creating Instagram Container..."
        )

        container_response = requests.post(

            container_url,

            data=container_data
        )

        container_result = (
            container_response.json()
        )

        print(
            "INSTAGRAM CONTAINER:",
            container_result
        )

        if "id" not in container_result:

            return {

                "status": "failed",

                "instagram_error":
                container_result

            }

        creation_id = (
            container_result["id"]
        )

        print(
            "Container Created:",
            creation_id
        )

        # ==========================================
        # WAIT
        # ==========================================

        ready = (
            InstagramService.wait_for_media_ready(

                creation_id,

                access_token

            )
        )

        if not ready:

            return {

                "status": "failed",

                "message":
                "Instagram media not ready"

            }

        # ==========================================
        # PUBLISH
        # ==========================================

        print(
            "Publishing Instagram media now..."
        )

        publish_url = (
            f"https://graph.instagram.com/"
            f"{instagram_id}/media_publish"
        )

        publish_data = {

            "creation_id":
            creation_id,

            "access_token":
            access_token

        }

        publish_response = requests.post(

            publish_url,

            data=publish_data
        )

        publish_result = (
            publish_response.json()
        )

        print(
            "INSTAGRAM PUBLISH:",
            publish_result
        )

        if "id" not in publish_result:

            return {

                "status": "failed",

                "instagram_error":
                publish_result

            }

        # ==========================================
        # PUBLISHED HISTORY
        # ==========================================

        post = PublishedPost(

            UserId=user_id,

            Platform="Instagram",

            Message=message,

            PostId=publish_result.get(
                "id"
            ),

            Status="Published"

        )

        db.add(
            post
        )

        db.commit()

        return {

            "status": "success",

            "platform": "Instagram",

            "post_id":
            publish_result.get("id")

        }