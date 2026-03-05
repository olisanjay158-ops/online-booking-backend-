import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("SMTP_USERNAME"),
    MAIL_PASSWORD=os.getenv("SMTP_PASSWORD"),
    MAIL_FROM=os.getenv("SMTP_FROM", os.getenv("SMTP_USERNAME")),
    MAIL_PORT=int(os.getenv("SMTP_PORT", "587")),
    MAIL_SERVER=os.getenv("SMTP_HOST", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

fm = FastMail(conf)

async def send_booking_confirmation(to_email: EmailStr, full_name: str, service_name: str, booking_time: str):
    subject = "✅ Booking Confirmed"
    body = f"""
Hi {full_name},

Your booking is confirmed ✅

Service: {service_name}
Time: {booking_time}

Thanks for booking!
— Online Booking System
"""
    message = MessageSchema(
        subject=subject,
        recipients=[to_email],
        body=body,
        subtype="plain",
    )
    await fm.send_message(message)