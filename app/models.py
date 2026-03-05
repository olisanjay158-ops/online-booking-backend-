from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(30), unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # one user -> many bookings
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    contact_email = Column(String, nullable=False) 

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    service_name = Column(String(120), nullable=False)  # e.g., "Haircut", "Massage"
    booking_time = Column(DateTime(timezone=True), nullable=False)

    notes = Column(String(500), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="bookings")