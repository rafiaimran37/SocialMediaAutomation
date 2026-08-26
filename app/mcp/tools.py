from sqlalchemy.orm import Session

from app.services.facebook_service import FacebookService
from app.services.instagram_service import InstagramService
from app.services.linkedin_service import LinkedInService
from app.config.database import SessionLocal


facebook_service = FacebookService()
instagram_service = InstagramService()
linkedin_service = LinkedInService()



def publish_facebook(message):

    db: Session = SessionLocal()

    try:

        result = facebook_service.create_post(

            db=db,

            user_id=1,

            message=message

        )

        return result


    finally:

        db.close()



def publish_instagram(message):

    return instagram_service.create_post(
        message
    )



def publish_linkedin(message):

    return linkedin_service.create_post(
        message
    )