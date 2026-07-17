from sqlalchemy.orm import Session
from app.models.user import User


class AuthService:

    @staticmethod
    def login(db: Session, email: str, password: str):

        user = db.query(User).filter(User.Email == email).first()

        if not user:
            return None

        # Temporary password check
        if user.Password != password:
            return None

        return user