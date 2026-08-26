from sqlalchemy.orm import Session

from app.models.client import Client


class ClientService:

    @staticmethod
    def get_clients(
        db: Session,
        user_id: int
    ):
        return (
            db.query(Client)
            .filter(
                Client.UserId == user_id
            )
            .order_by(
                Client.CreatedAt.desc()
            )
            .all()
        )

    @staticmethod
    def create_client(
        db: Session,
        user_id: int,
        client_name: str
    ):
        client = Client(
            UserId=user_id,
            ClientName=client_name.strip(),
            Status="Active"
        )

        db.add(client)
        db.commit()
        db.refresh(client)

        return client