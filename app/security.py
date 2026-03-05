# app/security.py

from datetime import datetime, timedelta, timezone
import hashlib

from jose import jwt
from passlib.context import CryptContext


# =========================================================
# JWT CONFIGURATION
# =========================================================

SECRET_KEY = "super-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# =========================================================
# PASSWORD HASHING CONFIGURATION
# =========================================================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =========================================================
# PASSWORD HASHING FUNCTIONS
# =========================================================

def prehash_password(password: str) -> str:
    """
    SHA256 prehash to bypass bcrypt 72 byte limit
    """
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def hash_password(password: str) -> str:
    """
    Hash password using SHA256 + bcrypt
    """
    prehashed = prehash_password(password)
    return pwd_context.hash(prehashed)


def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verify password against stored bcrypt hash
    """
    prehashed = prehash_password(password)
    return pwd_context.verify(prehashed, hashed_password)


# =========================================================
# JWT TOKEN CREATION
# =========================================================

def create_access_token(subject: str) -> str:
    """
    Create JWT token with subject=email
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": subject,   # VERY IMPORTANT: deps_auth reads this
        "exp": expire
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return token


# =========================================================
# JWT TOKEN DECODE (OPTIONAL HELPER)
# =========================================================

def decode_access_token(token: str) -> dict:
    """
    Decode JWT token
    """
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

def decode_token(token: str) -> dict:
    """
    Backwards-compatible alias for deps_auth.py
    """
    return decode_access_token(token)