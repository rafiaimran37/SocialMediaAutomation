from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.config.database import get_db
from app.services.facebook_service import FacebookService


router = APIRouter(
    prefix="/facebook",
    tags=["Facebook"]
)



class FacebookPostRequest(BaseModel):
    message: str



@router.post("/post")
def create_post(
    request: FacebookPostRequest,
    db: Session = Depends(get_db)
):

    result = FacebookService.create_post(

        db=db,

        user_id=1,

        message=request.message

    )


    return result