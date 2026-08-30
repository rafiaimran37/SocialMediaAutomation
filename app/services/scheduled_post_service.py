from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.scheduled_post import ScheduledPost
from app.models.scheduled_post_client import ScheduledPostClient
from app.models.approval_queue import ApprovalQueue
from app.models.client import Client

from app.models.post import Post
from app.models.post_status import PostStatus


class ScheduledPostService:

    @staticmethod
    def create_schedule(

        db: Session,

        user_id: int,

        data,

        media_path: str | None = None

    ):

        created_items = []

        # ==================================================
        # GET CLIENTS / STORES
        # ==================================================

        if data.store_selection == "all":

            clients = (

                db.query(Client)

                .filter(

                    Client.UserId == user_id,

                    Client.Status == "Active"

                )

                .all()

            )

            client_ids = [

                client.Id

                for client in clients

            ]

        else:

            client_ids = list(

                set(

                    int(client_id)

                    for client_id
                    in data.client_ids

                )

            )

            # ----------------------------------------------
            # MAKE SURE SELECTED CLIENTS BELONG TO USER
            # ----------------------------------------------

            valid_clients = (

                db.query(Client)

                .filter(

                    Client.UserId == user_id,

                    Client.Id.in_(client_ids),

                    Client.Status == "Active"

                )

                .all()

            )

            valid_client_ids = {

                client.Id

                for client
                in valid_clients

            }

            client_ids = [

                client_id

                for client_id
                in client_ids

                if client_id
                in valid_client_ids

            ]

        # ==================================================
        # SAFETY CHECK
        # ==================================================

        if not client_ids:

            raise ValueError(
                "No valid stores/clients selected"
            )

        if not data.platforms:

            raise ValueError(
                "At least one platform must be selected"
            )

        # ==================================================
        # CREATE POSTS
        # ==================================================

        for client_id in client_ids:

            for platform in data.platforms:

                platform = (
                    platform.strip().lower()
                )

                # ==========================================
                # APPROVAL REQUIRED
                # ==========================================

                if data.approval_required:

                    approval_request = ApprovalQueue(

                        UserId=user_id,

                        Message=data.message,

                        Platform=platform,

                        MediaPath=media_path,

                        ScheduledDate=
                            data.scheduled_date,

                        ScheduledTime=
                            data.scheduled_time,

                        Status="Pending"

                    )

                    db.add(
                        approval_request
                    )

                    created_items.append(
                        approval_request
                    )

                # ==========================================
                # DIRECT SCHEDULE
                # ==========================================

                else:

                    # --------------------------------------
                    # EXISTING SCHEDULED POST
                    # --------------------------------------

                    scheduled_post = ScheduledPost(

                        UserId=user_id,

                        Platform=platform,

                        MediaPath=media_path,

                        Message=data.message,

                        ScheduledDate=
                            data.scheduled_date,

                        ScheduledTime=
                            data.scheduled_time,

                        ApprovalRequired=False,

                        Status="Scheduled"

                    )

                    db.add(
                        scheduled_post
                    )

                    # We need ID before creating
                    # ScheduledPostClient
                    db.flush()

                    # --------------------------------------
                    # CONNECT POST WITH CLIENT
                    # --------------------------------------

                    post_client = ScheduledPostClient(

                        ScheduledPostId=
                            scheduled_post.Id,

                        ClientId=client_id

                    )

                    db.add(
                        post_client
                    )

                    # ======================================
                    # CREATE MASTER POST
                    # ======================================

                    post = Post(

                        UserId=user_id,

                        Message=data.message,

                        MediaPath=media_path

                    )

                    db.add(
                        post
                    )

                    # Get Post.Id
                    db.flush()

                    # ======================================
                    # CREATE POST STATUS
                    # ======================================

                    post_status = PostStatus(

                        PostId=post.Id,

                        ClientId=client_id,

                        Platform=platform,

                        Status="Pending"

                    )

                    db.add(
                        post_status
                    )

                    # --------------------------------------
                    # RETURN ORIGINAL SCHEDULED POST
                    # --------------------------------------

                    created_items.append(
                        scheduled_post
                    )

        # ==================================================
        # COMMIT EVERYTHING
        # ==================================================

        db.commit()

        # ==================================================
        # REFRESH ORIGINAL RESPONSE OBJECTS
        # ==================================================

        for item in created_items:

            db.refresh(item)

        return created_items

    # ======================================================
    # GET SCHEDULED POSTS
    # ======================================================

    @staticmethod
    def get_scheduled_posts(

        db: Session,

        user_id: int,

        platform: str | None = None,

        status: str | None = None

    ):

        query = (

            db.query(
                ScheduledPost
            )

            .filter(
                ScheduledPost.UserId == user_id
            )

        )

        if platform:

            query = query.filter(

                func.lower(
                    ScheduledPost.Platform
                )
                ==
                platform.lower()

            )

        if status:

            query = query.filter(

                func.lower(
                    ScheduledPost.Status
                )
                ==
                status.lower()

            )

        return (

            query

            .order_by(
                ScheduledPost.CreatedAt.desc()
            )

            .all()

        )

    # ======================================================
    # GET CLIENTS OF A SCHEDULED POST
    # ======================================================

    @staticmethod
    def get_post_clients(

        db: Session,

        scheduled_post_id: int

    ):

        return (

            db.query(
                ScheduledPostClient
            )

            .filter(

                ScheduledPostClient.ScheduledPostId
                ==
                scheduled_post_id

            )

            .all()

        )