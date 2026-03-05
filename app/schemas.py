from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ---------- AUTH ----------
class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str = Field(min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- USERS ----------
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- BOOKINGS ----------
class BookingCreate(BaseModel):
    service_name: str
    booking_time: datetime
    notes: Optional[str] = None
    contact_email: EmailStr   # ✅ NEW FIELD


# UPDATE BOOKING
class BookingUpdate(BaseModel):
    service_name: Optional[str] = None
    booking_time: Optional[datetime] = None
    notes: Optional[str] = None


class BookingOut(BaseModel):
    id: int
    user_id: int
    service_name: str
    booking_time: datetime
    notes: Optional[str] = None
    contact_email: EmailStr   # ✅ show in API response
    created_at: datetime

    class Config:
        from_attributes = True