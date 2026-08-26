from sqlalchemy.orm import Session

from app.models.approval_queue import ApprovalQueue
from app.models.scheduled_post import ScheduledPost


class ApprovalQueueService:

    @staticmethod
    def get_pending_approvals(db: Session, user_id: int):

        return (
            db.query(ApprovalQueue)
            .filter(
                ApprovalQueue.UserId == user_id,
                ApprovalQueue.Status == "Pending",
            )
            .order_by(
                ApprovalQueue.CreatedAt.desc()
            )
            .all()
        )

    @staticmethod
    def update_status(
        db: Session,
        user_id: int,
        approval_id: int,
        new_status: str
    ):

        # Make status case-insensitive
        new_status = new_status.capitalize()

        approval = (
            db.query(ApprovalQueue)
            .filter(
                ApprovalQueue.Id == approval_id,
                ApprovalQueue.UserId == user_id,
            )
            .first()
        )

        if not approval:

            return {
                "status": "failed",
                "message": "Approval request not found",
            }

        if approval.Status != "Pending":

            return {
                "status": "failed",
                "message": "Only pending approvals can be updated",
            }

        # ==========================
        # APPROVED FLOW
        # ==========================

        if new_status == "Approved":

            scheduled_post = ScheduledPost(

                UserId=approval.UserId,

                Platform=approval.Platform,

                MediaPath=approval.MediaPath,

                Message=approval.Message,

                ScheduledDate=approval.ScheduledDate,

                ScheduledTime=approval.ScheduledTime,

                Status="Scheduled",

                ApprovalRequired=False

            )

            db.add(scheduled_post)

        # Update Approval Queue status

        approval.Status = new_status

        db.commit()

        db.refresh(approval)

        return approval