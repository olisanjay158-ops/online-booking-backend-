from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from app import schemas, crud
from app.deps import get_db
from app.deps_auth import get_current_user
from app.models import User
from app.emailer import send_booking_confirmation

router = APIRouter(prefix="/bookings", tags=["Bookings"])


# CREATE
@router.post("", response_model=schemas.BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: schemas.BookingCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1) Create booking in DB (store customer contact email)
    booking = crud.create_booking_for_user(
        db=db,
        user_id=current_user.id,
        booking_in=booking_in,
        contact_email=str(booking_in.contact_email),
    )

    # 2) Send confirmation email in background (to customer)
    background_tasks.add_task(
        send_booking_confirmation,
        str(booking_in.contact_email),
        current_user.full_name,
        booking.service_name,
        str(booking.booking_time),
    )

    return booking


# READ MY BOOKINGS
@router.get("/me", response_model=List[schemas.BookingOut])
def list_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.list_user_bookings(db, current_user.id)


# READ ALL BOOKINGS (optional)
@router.get("", response_model=List[schemas.BookingOut])
def list_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.list_bookings(db)


# UPDATE BOOKING (owner only)
@router.patch("/{booking_id}", response_model=schemas.BookingOut)
def update_my_booking(
    booking_id: int,
    booking_in: schemas.BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = crud.get_booking_by_id(db, booking_id)

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    return crud.update_booking(db, booking, booking_in)


# DELETE BOOKING (owner only)
@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = crud.get_booking_by_id(db, booking_id)

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    crud.delete_booking(db, booking)
    return