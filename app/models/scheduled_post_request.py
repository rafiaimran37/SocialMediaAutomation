from pydantic import BaseModel, Field


class ScheduledPostRequest(BaseModel):

    platforms: list[str]

    message: str

    scheduled_date: str

    scheduled_time: str

    approval_required: bool = False

    store_selection: str = "all"

    client_ids: list[int] = Field(default_factory=list)