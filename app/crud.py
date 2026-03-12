from sqlalchemy.orm import Session
from sqlalchemy import or_

from app import models, schemas
from app.security import hash_password, verify_password


# ---------- USERS ----------
def create_user(db: Session, user_in: schemas.UserCreate):
    normalized_email = user_in.email.strip().lower()
    normalized_phone = user_in.phone.strip() if user_in.phone else None

    user = models.User(
        full_name=user_in.full_name.strip(),
        email=normalized_email,
        phone=normalized_phone,
        hashed_password=hash_password("TempPass@123"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    normalized_email = email.strip().lower()
    return db.query(models.User).filter(models.User.email == normalized_email).first()


def get_user_by_phone(db: Session, phone: str):
    normalized_phone = phone.strip()
    return db.query(models.User).filter(models.User.phone == normalized_phone).first()


def create_user_with_password(db: Session, user_in: schemas.UserSignup):
    normalized_email = user_in.email.strip().lower()
    normalized_phone = user_in.phone.strip() if user_in.phone else None
    normalized_name = user_in.full_name.strip()

    hashed = hash_password(user_in.password)

    print("SIGNUP DEBUG")
    print("email:", normalized_email)
    print("hash length:", len(hashed))
    print("hash preview:", hashed[:20])

    user = models.User(
        full_name=normalized_name,
        email=normalized_email,
        phone=normalized_phone,
        hashed_password=hashed,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    print("saved user id:", user.id)
    print("saved email:", user.email)
    print("saved hash length:", len(user.hashed_password))
    print("saved hash preview:", user.hashed_password[:20])

    return user


def authenticate_user(db: Session, email: str, password: str):
    normalized_email = email.strip().lower()
    user = get_user_by_email(db, normalized_email)

    print("LOGIN DEBUG")
    print("email:", normalized_email)
    print("user found:", bool(user))

    if not user:
        return None

    print("stored hash length:", len(user.hashed_password))
    print("stored hash preview:", user.hashed_password[:20])

    is_valid = verify_password(password, user.hashed_password)
    print("password valid:", is_valid)

    if not is_valid:
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
        contact_email=contact_email.strip().lower(),
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

    if hasattr(booking_in, "contact_email") and booking_in.contact_email is not None:
        booking.contact_email = booking_in.contact_email.strip().lower()

    db.commit()
    db.refresh(booking)
    return booking


def delete_booking(db: Session, booking: models.Booking):
    db.delete(booking)
    db.commit()