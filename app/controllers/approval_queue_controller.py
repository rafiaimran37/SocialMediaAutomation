from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.config.database import get_db
from app.services.approval_queue_service import ApprovalQueueService


router = APIRouter(
    prefix="/approval-queue",
    tags=["Approval Queue"],
)


def serialize_approval(approval):
    return {
        "Id": approval.Id,
        "UserId": approval.UserId,
        "Message": approval.Message,
        "Platform": approval.Platform,
        "MediaPath": getattr(approval, "MediaPath", None),
        "Status": approval.Status,
        "CreatedAt": approval.CreatedAt,
    }


@router.get("")
def get_approval_queue(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    approvals = ApprovalQueueService.get_pending_approvals(db=db, user_id=user_id)
    return [serialize_approval(approval) for approval in approvals]


@router.put("/{approval_id}/approve")
def approve_approval(
    approval_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    approval = ApprovalQueueService.update_status(
        db=db,
        user_id=user_id,
        approval_id=approval_id,
        new_status="Approved",
    )

    if isinstance(approval, dict):
        return approval

    return {
        "status": "success",
        "approval": serialize_approval(approval),
    }


@router.put("/{approval_id}/reject")
def reject_approval(
    approval_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    approval = ApprovalQueueService.update_status(
        db=db,
        user_id=user_id,
        approval_id=approval_id,
        new_status="Rejected",
    )

    if isinstance(approval, dict):
        return approval

    return {
        "status": "success",
        "approval": serialize_approval(approval),
    }