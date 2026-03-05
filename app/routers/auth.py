from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import schemas, crud
from app.deps import get_db
from app.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


# -----------------------------
# SIGNUP
# -----------------------------
@router.post("/signup", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def signup(user_in: schemas.UserSignup, db: Session = Depends(get_db)):

    # check email exists
    existing_email = crud.get_user_by_email(db, user_in.email)
    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # check phone exists
    existing_phone = crud.get_user_by_phone(db, user_in.phone)
    if existing_phone:
        raise HTTPException(
            status_code=400,
            detail="Phone already registered"
        )

    # create user
    user = crud.create_user_with_password(db, user_in)

    return user


# -----------------------------
# LOGIN (OAuth2 compatible)
# -----------------------------
@router.post("/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    # form_data.username = email
    user = crud.authenticate_user(
        db,
        email=form_data.username,
        password=form_data.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(subject=user.email)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# -----------------------------
# GET CURRENT USER
# -----------------------------
from app.deps_auth import get_current_user
from app.models import User


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user