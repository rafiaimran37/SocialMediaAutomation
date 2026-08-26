from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.social_account import SocialAccount
from app.models.client import Client
from app.auth.dependencies import get_current_user
from app.services.social_account_service import SocialAccountService


router = APIRouter(
    prefix="/social",
    tags=["Social Accounts"]
)


# Get all social accounts of the logged-in user
@router.get("/accounts")
def get_accounts(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    accounts = db.query(SocialAccount).filter(
        SocialAccount.UserId == user_id
    ).all()

    return accounts


# Get social accounts of a specific client
@router.get("/clients/{client_id}/accounts")
def get_client_accounts(
    client_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Make sure this client belongs to the logged-in user
    client = db.query(Client).filter(
        Client.Id == client_id,
        Client.UserId == user_id
    ).first()

    if not client:
        return {
            "status": "failed",
            "message": "Client not found"
        }

    # Get only this client's social accounts
    accounts = db.query(SocialAccount).filter(
        SocialAccount.UserId == user_id,
        SocialAccount.ClientId == client_id
    ).all()

    return accounts


# Delete social account
@router.delete("/accounts/{account_id}")
def delete_account(
    account_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return SocialAccountService.delete_social_account(
        db=db,
        account_id=account_id
    )