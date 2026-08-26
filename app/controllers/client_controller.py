from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.config.database import get_db
from app.services.client_service import ClientService


router = APIRouter(
    prefix="/clients",
    tags=["Clients"]
)


class ClientCreateRequest(BaseModel):
    clientName: str


def serialize_client(client):
    return {
        "Id": client.Id,
        "ClientName": client.ClientName,
        "Status": client.Status,
        "CreatedAt": client.CreatedAt,
    }


@router.get("")
def get_clients(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    clients = ClientService.get_clients(
        db,
        user_id
    )

    return [
        {
            "Id": client.Id,
            "ClientName": client.ClientName,
            "Status": client.Status,
            "CreatedAt": client.CreatedAt
        }
        for client in clients
    ]


@router.post("")
def create_client(
    request: ClientCreateRequest,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    client_name = request.clientName.strip()

    if not client_name:
        return {
            "status": "failed",
            "message": "Client name is required"
        }

    client = ClientService.create_client(
        db=db,
        user_id=user_id,
        client_name=client_name
    )

    return serialize_client(client)