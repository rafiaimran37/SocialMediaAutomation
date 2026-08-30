from apscheduler.schedulers.background import (
    BackgroundScheduler
)

from datetime import datetime

from sqlalchemy import func

from concurrent.futures import (
    ThreadPoolExecutor
)

from app.config.database import (
    SessionLocal
)

from app.models.scheduled_post import (
    ScheduledPost
)

from app.models.scheduled_post_client import (
    ScheduledPostClient
)

from app.models.post import (
    Post
)

from app.models.post_status import (
    PostStatus
)

from app.services.publish_service import (
    PublishService
)


scheduler = BackgroundScheduler()


# ==========================================================
# PUBLISH SINGLE POST
# ==========================================================

def publish_single_post(

    post_id,

    client_id

):

    db = SessionLocal()

    try:

        # ==================================================
        # FETCH SCHEDULED POST
        # ==================================================

        post = (

            db.query(
                ScheduledPost
            )

            .filter(
                ScheduledPost.Id
                == post_id
            )

            .first()

        )

        if not post:

            print(
                "Post not found:",
                post_id
            )

            return

        print(
            "----------------------"
        )

        print(
            "Publishing scheduled post..."
        )

        print(
            "Scheduled Post ID:",
            post.Id
        )

        print(
            "Client ID:",
            client_id
        )

        print(
            "Platform:",
            post.Platform
        )

        print(
            "Message:",
            post.Message
        )

        print(
            "Media:",
            post.MediaPath
        )

        # ==================================================
        # FIND MASTER POST
        # ==================================================

        master_post = (

            db.query(
                Post
            )

            .filter(

                Post.UserId
                == post.UserId,

                Post.Message
                == post.Message

            )

            .order_by(
                Post.Id.desc()
            )

            .first()

        )

        # ==================================================
        # FIND POST STATUS
        # ==================================================

        post_status = None

        if master_post:

            post_status = (

                db.query(
                    PostStatus
                )

                .filter(

                    PostStatus.PostId
                    == master_post.Id,

                    PostStatus.ClientId
                    == client_id,

                    func.lower(
                        PostStatus.Platform
                    )
                    ==
                    post.Platform.lower()

                )

                .first()

            )

        # ==================================================
        # PUBLISH
        # ==================================================

        publish_result = (

            PublishService.publish_post(

                db,

                post.UserId,

                client_id,

                post.Platform,

                post.Message,

                post.MediaPath

            )

        )

        # ==================================================
        # DETERMINE SUCCESS
        # ==================================================

        if isinstance(
            publish_result,
            dict
        ):

            success = (
                publish_result.get("status")
                == "success"
            )

        else:

            success = bool(
                publish_result
            )

        # ==================================================
        # SUCCESS
        # ==================================================

        if success:

            print(

                "Post Published Successfully:",

                post.Id,

                "Client:",

                client_id

            )

            # ----------------------------------------------
            # UPDATE SCHEDULED POST
            # ----------------------------------------------

            post.Status = "Published"

            # ----------------------------------------------
            # UPDATE POST STATUS
            # ----------------------------------------------

            if post_status:

                post_status.Status = "Published"

                post_status.PublishedAt = (
                    datetime.now()
                )

                # Try to get platform post ID
                if isinstance(
                    publish_result,
                    dict
                ):

                    post_status.PlatformPostId = (

                        publish_result.get(
                            "post_id"
                        )

                        or publish_result.get(
                            "platform_post_id"
                        )

                    )

                    post_status.ErrorMessage = None

            db.commit()

        # ==================================================
        # FAILED
        # ==================================================

        else:

            print(

                "Publishing Failed:",

                post.Id,

                "Client:",

                client_id

            )

            post.Status = "Failed"

            # ----------------------------------------------
            # UPDATE POST STATUS
            # ----------------------------------------------

            if post_status:

                post_status.Status = "Failed"

                if isinstance(
                    publish_result,
                    dict
                ):

                    post_status.ErrorMessage = str(

                        publish_result.get(
                            "facebook_error"
                        )

                        or publish_result.get(
                            "instagram_error"
                        )

                        or publish_result.get(
                            "linkedin_error"
                        )

                        or publish_result.get(
                            "message"
                        )

                        or "Publishing failed"

                    )

                else:

                    post_status.ErrorMessage = (
                        "Publishing failed"
                    )

            db.commit()

    except Exception as error:

        db.rollback()

        print(
            "Publishing Error:",
            error
        )

    finally:

        db.close()


# ==========================================================
# CHECK SCHEDULED POSTS
# ==========================================================

def check_scheduled_posts():

    db = SessionLocal()

    ready_posts = []

    try:

        current_time = datetime.now()

        print(
            "\nChecking database at:",
            current_time
        )

        # ==================================================
        # GET SCHEDULED POSTS
        # ==================================================

        posts = (

            db.query(
                ScheduledPost
            )

            .filter(

                ScheduledPost.Status
                == "Scheduled"

            )

            .all()

        )

        for post in posts:

            print(

                "DEBUG POST:",

                post.Id,

                "| Platform:",

                post.Platform,

                "| Date:",

                repr(
                    post.ScheduledDate
                ),

                "| Time:",

                repr(
                    post.ScheduledTime
                ),

                "| Status:",

                post.Status

            )

            # ==================================================
            # DATE / TIME CHECK
            # ==================================================

            try:

                if (

                    post.ScheduledDate

                    and

                    post.ScheduledTime

                ):

                    scheduled_datetime = (

                        datetime.strptime(

                            f"{post.ScheduledDate} "
                            f"{post.ScheduledTime}",

                            "%Y-%m-%d %H:%M"

                        )

                    )

                    print(

                        "Scheduled datetime:",

                        scheduled_datetime,

                        "| Current datetime:",

                        current_time

                    )

                    if (

                        scheduled_datetime
                        <=
                        current_time

                    ):

                        # ==================================
                        # GET CLIENTS
                        # ==================================

                        client_links = (

                            db.query(
                                ScheduledPostClient
                            )

                            .filter(

                                ScheduledPostClient
                                .ScheduledPostId
                                ==
                                post.Id

                            )

                            .all()

                        )

                        for link in client_links:

                            ready_posts.append(

                                (

                                    post.Id,

                                    link.ClientId

                                )

                            )

            except Exception as error:

                print(

                    "Date parsing error:",

                    error

                )

        print(

            "Total scheduled posts:",

            len(posts)

        )

        print(

            "Posts ready for publishing:",

            len(ready_posts)

        )

    finally:

        db.close()

    # ==================================================
    # PARALLEL PUBLISHING
    # ==================================================

    if ready_posts:

        print(
            "Starting parallel publishing..."
        )

        with ThreadPoolExecutor(

            max_workers=5

        ) as executor:

            futures = [

                executor.submit(

                    publish_single_post,

                    post_id,

                    client_id

                )

                for post_id, client_id
                in ready_posts

            ]

            for future in futures:

                try:

                    future.result()

                except Exception as error:

                    print(

                        "Worker error:",

                        error

                    )


# ==========================================================
# START SCHEDULER
# ==========================================================

def start_scheduler():

    # ==================================================
    # AVOID DUPLICATE JOB
    # ==================================================

    scheduler.add_job(

        check_scheduled_posts,

        "interval",

        seconds=10,

        id="scheduled_post_checker",

        replace_existing=True

    )

    scheduler.start()

    print(
        "Background Scheduler Started"
    )


# ==========================================================
# SHUTDOWN SCHEDULER
# ==========================================================

def shutdown_scheduler():

    if scheduler.running:

        scheduler.shutdown()

    print(
        "Background Scheduler Stopped"
    )