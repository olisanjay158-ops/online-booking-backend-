from fastapi import APIRouter
from pydantic import BaseModel, EmailStr, validator

router = APIRouter()

class UserValidation(BaseModel):
    name: str
    email: EmailStr
    age: int

    @validator("name")
    def validate_name(cls, v):
        if len(v.strip()) < 2 or len(v.strip()) > 50:
            raise ValueError("Invalid name length")
        return v

    @validator("age")
    def validate_age(cls, v):
        if v < 0 or v > 120:
            raise ValueError("Invalid age")
        return v


@router.post("/validate-user")
def validate_user(user: UserValidation):
    return {"message": "Valid input"}