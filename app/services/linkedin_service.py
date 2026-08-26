import os
import requests

from app.models.social_account import SocialAccount
from app.models.published_post import PublishedPost


class LinkedInService:

    def __init__(self):
        print("LinkedIn Service Started")

    def create_post(
        self,
        db,
        user_id,
        message,
        media_path=None
    ):

        print("Creating LinkedIn post...")
        print("Message:", message)
        print("Media Path:", media_path)

        # ==========================================
        # GET CONNECTED LINKEDIN ACCOUNT
        # ==========================================

        account = (
            db.query(SocialAccount)
            .filter(
                SocialAccount.UserId == user_id,
                SocialAccount.Platform == "LinkedIn"
            )
            .first()
        )

        if not account:

            return {
                "status": "failed",
                "message": "LinkedIn account not connected"
            }

        access_token = account.AccessToken

        linkedin_user_id = account.FacebookUserId

        print(
            "LinkedIn User ID:",
            linkedin_user_id
        )

        print(
            "Token:",
            access_token[:20] + "..."
        )

        # ==========================================
        # LINKEDIN HEADERS
        # ==========================================

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "LinkedIn-Version": "202601",
            "X-Restli-Protocol-Version": "2.0.0"
        }

        # ==========================================
        # TEXT ONLY
        # ==========================================

        if not media_path:

            print("No media found. Creating text-only post.")

            payload = {

                "author":
                    f"urn:li:person:{linkedin_user_id}",

                "commentary":
                    message,

                "visibility":
                    "PUBLIC",

                "distribution": {

                    "feedDistribution":
                        "MAIN_FEED",

                    "targetEntities":
                        [],

                    "thirdPartyDistributionChannels":
                        []

                },

                "lifecycleState":
                    "PUBLISHED",

                "isReshareDisabledByAuthor":
                    False
            }

            response = requests.post(
                "https://api.linkedin.com/rest/posts",
                headers=headers,
                json=payload
            )

            print(
                "LINKEDIN TEXT RESPONSE:",
                response.status_code,
                response.text
            )

            if response.status_code not in [200, 201]:

                return {
                    "status": "failed",
                    "linkedin_error": response.text
                }

            post_id = response.headers.get(
                "x-restli-id"
            )

            published_post = PublishedPost(
                UserId=user_id,
                Platform="LinkedIn",
                Message=message,
                PostId=post_id,
                Status="Published"
            )

            db.add(published_post)
            db.commit()

            return {
                "status": "success",
                "platform": "LinkedIn",
                "post_id": post_id
            }

        # ==========================================
        # FIND ACTUAL FILE
        # ==========================================

        relative_path = media_path.lstrip("/\\")

        project_root = os.path.abspath(
            os.path.join(
                os.path.dirname(__file__),
                ".."
            )
        )

        file_path = os.path.join(
            project_root,
            relative_path
        )

        file_path = os.path.normpath(file_path)

        print(
            "LinkedIn File Path:",
            file_path
        )

        if not os.path.exists(file_path):

            return {
                "status": "failed",
                "message": f"Media file not found: {file_path}"
            }

        # ==========================================
        # DETERMINE MEDIA TYPE
        # ==========================================

        extension = os.path.splitext(
            file_path
        )[1].lower()

        image_extensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".gif"
        ]

        video_extensions = [
            ".mp4",
            ".mov",
            ".avi",
            ".mkv"
        ]

        # ==========================================
        # IMAGE
        # ==========================================

        if extension in image_extensions:

            print("LinkedIn media type: IMAGE")

            image_urn = self.upload_image(
                access_token,
                linkedin_user_id,
                file_path
            )

            if not image_urn:

                return {
                    "status": "failed",
                    "message": "LinkedIn image upload failed"
                }

            payload = {

                "author":
                    f"urn:li:person:{linkedin_user_id}",

                "commentary":
                    message,

                "visibility":
                    "PUBLIC",

                "distribution": {

                    "feedDistribution":
                        "MAIN_FEED",

                    "targetEntities":
                        [],

                    "thirdPartyDistributionChannels":
                        []

                },

                "content": {

                    "media": {

                        "id":
                            image_urn

                    }

                },

                "lifecycleState":
                    "PUBLISHED",

                "isReshareDisabledByAuthor":
                    False
            }

        # ==========================================
        # VIDEO
        # ==========================================

        elif extension in video_extensions:

            print("LinkedIn media type: VIDEO")

            video_urn = self.upload_video(
                access_token,
                linkedin_user_id,
                file_path
            )

            if not video_urn:

                return {
                    "status": "failed",
                    "message": "LinkedIn video upload failed"
                }

            payload = {

                "author":
                    f"urn:li:person:{linkedin_user_id}",

                "commentary":
                    message,

                "visibility":
                    "PUBLIC",

                "distribution": {

                    "feedDistribution":
                        "MAIN_FEED",

                    "targetEntities":
                        [],

                    "thirdPartyDistributionChannels":
                        []

                },

                "content": {

                    "media": {

                        "id":
                            video_urn

                    }

                },

                "lifecycleState":
                    "PUBLISHED",

                "isReshareDisabledByAuthor":
                    False
            }

        else:

            return {
                "status": "failed",
                "message":
                    f"Unsupported media type: {extension}"
            }

        # ==========================================
        # CREATE LINKEDIN MEDIA POST
        # ==========================================

        print("Sending media post to LinkedIn...")

        response = requests.post(
            "https://api.linkedin.com/rest/posts",
            headers=headers,
            json=payload
        )

        print(
            "LINKEDIN MEDIA RESPONSE:",
            response.status_code,
            response.text
        )

        if response.status_code not in [200, 201]:

            return {
                "status": "failed",
                "linkedin_error":
                    response.text
            }

        post_id = response.headers.get(
            "x-restli-id"
        )

        # ==========================================
        # SAVE PUBLISHED HISTORY
        # ==========================================

        published_post = PublishedPost(
            UserId=user_id,
            Platform="LinkedIn",
            Message=message,
            PostId=post_id,
            Status="Published"
        )

        db.add(published_post)
        db.commit()

        return {

            "status":
                "success",

            "platform":
                "LinkedIn",

            "post_id":
                post_id
        }

    # ==================================================
    # IMAGE UPLOAD
    # ==================================================

    def upload_image(
        self,
        access_token,
        linkedin_user_id,
        file_path
    ):

        print("Uploading image to LinkedIn...")

        headers = {
            "Authorization":
                f"Bearer {access_token}",

            "LinkedIn-Version":
                "202601",

            "X-Restli-Protocol-Version":
                "2.0.0"
        }

        # ------------------------------------------
        # STEP 1: INITIALIZE IMAGE UPLOAD
        # ------------------------------------------

        initialize_url = (
            "https://api.linkedin.com/rest/images?action=initializeUpload"
        )

        initialize_payload = {

            "initializeUploadRequest": {

                "owner":
                    f"urn:li:person:{linkedin_user_id}"
            }
        }

        response = requests.post(
            initialize_url,
            headers={
                **headers,
                "Content-Type":
                    "application/json"
            },
            json=initialize_payload
        )

        print(
            "IMAGE INITIALIZE:",
            response.status_code,
            response.text
        )

        if response.status_code not in [200, 201]:

            return None

        data = response.json()

        value = data.get(
            "value",
            {}
        )

        upload_url = value.get(
            "uploadUrl"
        )

        image_urn = value.get(
            "image"
        )

        if not upload_url or not image_urn:

            print(
                "Image upload URL/URN missing"
            )

            return None

        # ------------------------------------------
        # STEP 2: UPLOAD IMAGE
        # ------------------------------------------

        with open(
            file_path,
            "rb"
        ) as image_file:

            upload_response = requests.put(
                upload_url,
                headers={
                    "Authorization":
                        f"Bearer {access_token}"
                },
                data=image_file
            )

        print(
            "IMAGE UPLOAD:",
            upload_response.status_code,
            upload_response.text
        )

        if upload_response.status_code not in [
            200,
            201
        ]:

            return None

        print(
            "IMAGE URN:",
            image_urn
        )

        return image_urn

    # ==================================================
    # VIDEO UPLOAD
    # ==================================================

    def upload_video(
        self,
        access_token,
        linkedin_user_id,
        file_path
    ):

        print("Uploading video to LinkedIn...")

        headers = {
            "Authorization":
                f"Bearer {access_token}",

            "LinkedIn-Version":
                "202601",

            "X-Restli-Protocol-Version":
                "2.0.0",

            "Content-Type":
                "application/json"
        }

        # ------------------------------------------
        # STEP 1: INITIALIZE VIDEO UPLOAD
        # ------------------------------------------

        initialize_url = (
            "https://api.linkedin.com/rest/videos?action=initializeUpload"
        )

        file_size = os.path.getsize(
            file_path
        )

        initialize_payload = {

            "initializeUploadRequest": {

                "owner":
                    f"urn:li:person:{linkedin_user_id}",

                "fileSizeBytes":
                    file_size,

                "uploadCaptions":
                    False,

                "uploadThumbnail":
                    False
            }
        }

        response = requests.post(
            initialize_url,
            headers=headers,
            json=initialize_payload
        )

        print(
            "VIDEO INITIALIZE:",
            response.status_code,
            response.text
        )

        if response.status_code not in [
            200,
            201
        ]:

            return None

        data = response.json()

        value = data.get(
            "value",
            {}
        )

        video_urn = value.get(
            "video"
        )

        upload_instructions = value.get(
            "uploadInstructions",
            []
        )

        if not video_urn or not upload_instructions:

            print(
                "Video upload information missing"
            )

            return None

        # ------------------------------------------
        # STEP 2: UPLOAD VIDEO PARTS
        # ------------------------------------------

        with open(
            file_path,
            "rb"
        ) as video_file:

            for instruction in upload_instructions:

                upload_url = instruction.get(
                    "uploadUrl"
                )

                first_byte = instruction.get(
                    "firstByte"
                )

                last_byte = instruction.get(
                    "lastByte"
                )

                if (
                    upload_url is None
                    or first_byte is None
                    or last_byte is None
                ):

                    continue

                video_file.seek(
                    first_byte
                )

                chunk_size = (
                    last_byte
                    - first_byte
                    + 1
                )

                chunk = video_file.read(
                    chunk_size
                )

                upload_response = requests.put(
                    upload_url,
                    data=chunk
                )

                print(
                    "VIDEO CHUNK:",
                    upload_response.status_code
                )

                if upload_response.status_code not in [
                    200,
                    201,
                    202
                ]:

                    print(
                        "Video chunk upload failed:",
                        upload_response.text
                    )

                    return None

        # ------------------------------------------
        # STEP 3: FINALIZE VIDEO
        # ------------------------------------------

        finalize_url = (
            "https://api.linkedin.com/rest/videos?action=finalizeUpload"
        )

        finalize_payload = {

            "finalizeUploadRequest": {

                "video":
                    video_urn
            }
        }

        finalize_response = requests.post(
            finalize_url,
            headers=headers,
            json=finalize_payload
        )

        print(
            "VIDEO FINALIZE:",
            finalize_response.status_code,
            finalize_response.text
        )

        if finalize_response.status_code not in [
            200,
            201,
            202
        ]:

            return None

        print(
            "VIDEO URN:",
            video_urn
        )

        return video_urn
