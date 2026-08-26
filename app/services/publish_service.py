from app.services.facebook_service import FacebookService
from app.services.instagram_service import InstagramService
from app.services.linkedin_service import LinkedInService


class PublishService:

    @staticmethod
    def publish_post(
        db,
        user_id,
        client_id,
        platform,
        message,
        media_path=None
    ):

        print("----------------------")

        print(
            "Publishing post..."
        )

        print(
            "User ID:",
            user_id
        )

        print(
            "Client ID:",
            client_id
        )

        print(
            "Platform:",
            platform
        )

        print(
            "Message:",
            message
        )

        print(
            "Media:",
            media_path
        )

        platform = platform.lower()

        # ==========================================
        # FACEBOOK
        # ==========================================

        if platform == "facebook":

            result = FacebookService.create_post(

                db,

                user_id,

                client_id,

                message,

                media_path
            )

        # ==========================================
        # INSTAGRAM
        # ==========================================

        elif platform == "instagram":

            result = InstagramService.create_post(

                db,

                user_id,

                client_id,

                message,

                media_path
            )

        # ==========================================
        # LINKEDIN
        # ==========================================

        elif platform == "linkedin":

            service = LinkedInService()

            result = service.create_post(

                db,

                user_id,

                client_id,

                message,

                media_path
            )

        else:

            print(
                "Platform not supported:",
                platform
            )

            return False

        print(
            "Publish Result:",
            result
        )

        return (
            isinstance(result, dict)
            and result.get("status")
            == "success"
        )