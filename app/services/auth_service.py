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

    @staticmethod
    def get_user_by_id(db: Session, user_id: int):

        return db.query(User).filter(User.Id == user_id).first()

    @staticmethod
    def update_full_name(db: Session, user_id: int, full_name: str):

        user = AuthService.get_user_by_id(db, user_id)

        if not user:
            return None

        user.FullName = full_name
        db.commit()
        db.refresh(user)

        return user