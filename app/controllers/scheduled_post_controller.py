import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, Request, UploadFile
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.config.database import get_db
from app.models.scheduled_post_request import ScheduledPostRequest
from app.services.scheduled_post_service import ScheduledPostService


router = APIRouter(
    prefix="/scheduled-posts",
    tags=["Scheduled Posts"]
)


UPLOAD_ROOT = (
    Path(__file__).resolve().parents[1]
    / "uploads"
    / "scheduled-posts"
)

UPLOAD_ROOT.mkdir(
    parents=True,
    exist_ok=True
)


def serialize_post(post):

    response = {
        "Id": post.Id,
        "Platform": post.Platform,
        "Message": post.Message,
        "MediaPath": getattr(
            post,
            "MediaPath",
            None
        ),
        "Status": post.Status,
        "ScheduledDate": getattr(
            post,
            "ScheduledDate",
            None
        ),
        "ScheduledTime": getattr(
            post,
            "ScheduledTime",
            None
        ),
        "ApprovalRequired": getattr(
            post,
            "ApprovalRequired",
            False
        )
    }

    return response


async def save_media_file(
    upload_file: UploadFile | None
):

    if (
        not upload_file
        or not upload_file.filename
    ):
        return None

    suffix = Path(
        upload_file.filename
    ).suffix.lower()

    safe_name = (
        f"{uuid4().hex}{suffix}"
    )

    destination = (
        UPLOAD_ROOT / safe_name
    )

    try:

        with destination.open("wb") as output_file:

            shutil.copyfileobj(
                upload_file.file,
                output_file
            )

    finally:

        await upload_file.close()

    return (
        f"/uploads/scheduled-posts/{safe_name}"
    )


@router.post("")
async def create_schedule(

    request: Request,

    user_id: int = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db)
):

    content_type = request.headers.get(
        "content-type",
        ""
    )

    # ==================================================
    # MULTIPART / MEDIA REQUEST
    # ==================================================

    if content_type.startswith(
        "multipart/form-data"
    ):

        form = await request.form()

        media_file = form.get(
            "media_file"
        )

        platforms = form.getlist(
            "platforms"
        )

        client_ids_raw = form.getlist(
            "client_ids"
        )

        client_ids = []

        for client_id in client_ids_raw:

            try:

                client_ids.append(
                    int(client_id)
                )

            except (
                ValueError,
                TypeError
            ):

                pass

        data = ScheduledPostRequest(

            platforms=platforms,

            message=form.get(
                "message",
                ""
            ),

            scheduled_date=form.get(
                "scheduled_date",
                ""
            ),

            scheduled_time=form.get(
                "scheduled_time",
                ""
            ),

            approval_required=(
                str(
                    form.get(
                        "approval_required",
                        "false"
                    )
                ).lower()
                == "true"
            ),

            store_selection=form.get(
                "store_selection",
                "all"
            ),

            client_ids=client_ids
        )

        media_path = await save_media_file(

            media_file
            if getattr(
                media_file,
                "filename",
                None
            )
            else None

        )

    # ==================================================
    # JSON REQUEST
    # ==================================================

    else:

        data = ScheduledPostRequest.model_validate(
            await request.json()
        )

        media_path = None

    # ==================================================
    # CREATE
    # ==================================================

    try:

        posts = ScheduledPostService.create_schedule(

            db=db,

            user_id=user_id,

            data=data,

            media_path=media_path
        )

    except ValueError as error:

        return {
            "status": "failed",
            "message": str(error)
        }

    return {

        "status": "success",

        "data": [
            serialize_post(post)
            for post in posts
        ]

    }


@router.get("")
def get_schedules(

    user_id: int = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db),

    platform: str | None = None,

    status: str | None = None

):

    posts = (
        ScheduledPostService.get_scheduled_posts(

            db=db,

            user_id=user_id,

            platform=platform,

            status=status
        )
    )

    return [
        serialize_post(post)
        for post in posts
    ]