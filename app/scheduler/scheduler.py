from apscheduler.schedulers.background import (
    BackgroundScheduler
)

from datetime import datetime

from concurrent.futures import (
    ThreadPoolExecutor
)

from app.config.database import SessionLocal

from app.models.scheduled_post import (
    ScheduledPost
)

from app.models.scheduled_post_client import (
    ScheduledPostClient
)

from app.services.publish_service import (
    PublishService
)


scheduler = BackgroundScheduler()


def publish_single_post(
    post_id,
    client_id
):

    db = SessionLocal()

    try:

        # ==========================================
        # FETCH POST
        # ==========================================

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
            "Post ID:",
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

        # ==========================================
        # PUBLISH
        # ==========================================

        success = (

            PublishService.publish_post(

                db,

                post.UserId,

                client_id,

                post.Platform,

                post.Message,

                post.MediaPath

            )

        )

        if success:

            print(
                "Post Published Successfully:",
                post.Id,
                "Client:",
                client_id
            )

            post.Status = "Published"

            db.commit()

        else:

            print(
                "Publishing Failed:",
                post.Id,
                "Client:",
                client_id
            )

            post.Status = "Failed"

            db.commit()

    except Exception as error:

        db.rollback()

        print(
            "Publishing Error:",
            error
        )

    finally:

        db.close()


def check_scheduled_posts():

    db = SessionLocal()

    ready_posts = []

    try:

        current_time = datetime.now()

        print(
            "\nChecking database at:",
            current_time
        )

        # ==========================================
        # GET SCHEDULED POSTS
        # ==========================================

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
                repr(post.ScheduledDate),
                "| Time:",
                repr(post.ScheduledTime),
                "| Status:",
                post.Status
            )

            # ==========================================
            # DATE / TIME CHECK
            # ==========================================

            try:

                if (
                    post.ScheduledDate
                    and post.ScheduledTime
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
                        <= current_time
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
                                == post.Id

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

    # ==========================================
    # PARALLEL PUBLISHING
    # ==========================================

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


def start_scheduler():

    # ==========================================
    # AVOID DUPLICATE JOB
    # ==========================================

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


def shutdown_scheduler():

    if scheduler.running:

        scheduler.shutdown()

    print(
        "Background Scheduler Stopped"
    )