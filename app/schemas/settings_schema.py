from pydantic import BaseModel, EmailStr


class SettingsProfileResponse(BaseModel):
    fullName: str
    email: EmailStr


class SettingsProfileUpdateRequest(BaseModel):
    fullName: str