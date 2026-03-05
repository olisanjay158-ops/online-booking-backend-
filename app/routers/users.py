from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas, crud
from app.deps import get_db

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def create_user(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email_or_phone(db, user_in.email, user_in.phone)
    if existing:
        raise HTTPException(status_code=400, detail="User with this email/phone already exists")
    return crud.create_user(db, user_in)


@router.get("", response_model=list[schemas.UserOut])
def list_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return crud.list_users(db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{user_id}/bookings", response_model=list[schemas.BookingOut])
def user_bookings(user_id: int, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.list_user_bookings(db, user_id=user_id, skip=skip, limit=limit)