from sqlalchemy.orm import Session
from sqlalchemy import or_

from app import models, schemas
from app.security import hash_password, verify_password


# ---------- USERS ----------
def create_user(db: Session, user_in: schemas.UserCreate):
    user = models.User(
        full_name=user_in.full_name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=hash_password("TempPass@123"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_phone(db: Session, phone: str):
    return db.query(models.User).filter(models.User.phone == phone).first()


def create_user_with_password(db: Session, user_in: schemas.UserSignup):
    user = models.User(
        full_name=user_in.full_name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=hash_password(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user


# ---------- BOOKINGS ----------
def create_booking_for_user(
    db: Session,
    user_id: int,
    booking_in: schemas.BookingCreate,
    contact_email: str,
):
    booking = models.Booking(
        user_id=user_id,
        service_name=booking_in.service_name,
        booking_time=booking_in.booking_time,
        notes=booking_in.notes,
        contact_email=contact_email,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def list_bookings(db: Session, skip: int = 0, limit: int = 50):
    return db.query(models.Booking).offset(skip).limit(limit).all()


def list_user_bookings(db: Session, user_id: int, skip: int = 0, limit: int = 50):
    return (
        db.query(models.Booking)
        .filter(models.Booking.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_booking_by_id(db: Session, booking_id: int):
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()


def update_booking(db: Session, booking: models.Booking, booking_in: schemas.BookingUpdate):
    if booking_in.service_name is not None:
        booking.service_name = booking_in.service_name

    if booking_in.booking_time is not None:
        booking.booking_time = booking_in.booking_time

    if booking_in.notes is not None:
        booking.notes = booking_in.notes

    db.commit()
    db.refresh(booking)
    return booking


def delete_booking(db: Session, booking: models.Booking):
    db.delete(booking)
    db.commit()