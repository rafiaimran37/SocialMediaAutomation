from sqlalchemy.orm import Session
from app.models.social_account import SocialAccount



class SocialAccountService:


    @staticmethod
    def save_social_account(
    db: Session,
    user_id: int,
    client_id: int,
    platform: str,
    access_token: str,
    page_id: str = None,
    facebook_user_id: str = None,
    account_name: str = None,
    email: str = None
):



        # Same account check
        existing_account = db.query(
            SocialAccount
        ).filter(

SocialAccount.UserId == user_id,
SocialAccount.ClientId == client_id,
SocialAccount.Platform == platform,
SocialAccount.FacebookUserId == facebook_user_id

        ).first()



        if existing_account:


            # Update existing account

            existing_account.AccessToken = access_token
            existing_account.PageId = page_id
            existing_account.AccountName = account_name
            existing_account.Email = email
            existing_account.Status = "Connected"


            db.commit()
            db.refresh(existing_account)


            return existing_account




        else:


            # Create new account

            social_account = SocialAccount(

                UserId=user_id,

                ClientId=client_id,

                Platform=platform,

                AccessToken=access_token,

                PageId=page_id,

                FacebookUserId=facebook_user_id,

                AccountName=account_name,

                Email=email,

                Status="Connected"

            )


            db.add(social_account)

            db.commit()

            db.refresh(social_account)


            return social_account


    @staticmethod
    def delete_social_account(
        db: Session,
        account_id: int
    ):


        social_account = db.query(
            SocialAccount
        ).filter(
            SocialAccount.Id == account_id
        ).first()


        if not social_account:
            return {
                "status": "failed",
                "message": "Social account not found"
            }


        db.delete(social_account)
        db.commit()


        return {
            "status": "success",
            "message": "Social account deleted successfully"
        }