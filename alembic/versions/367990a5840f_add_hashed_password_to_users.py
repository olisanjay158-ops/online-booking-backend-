"""add hashed_password to users

Revision ID: 367990a5840f
Revises: 38eb963ee4d6
Create Date: 2026-02-27 03:18:48.088216

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text


# revision identifiers, used by Alembic.
revision: str = "367990a5840f"
down_revision: Union[str, Sequence[str], None] = "38eb963ee4d6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1) Add column as nullable first (so existing rows don't break)
    op.add_column("users", sa.Column("hashed_password", sa.String(), nullable=True))

    # 2) Fill existing users with a temporary bcrypt hash (NOT plaintext)
    # This avoids NULL values before we enforce NOT NULL.
    op.execute(
        text(
            "UPDATE users "
            "SET hashed_password = '$2b$12$h1dYl8d9mFz1vVnqXgH9Ue2zv2S3gQ1XWZ8j6m3dCq7dX1hXG4s8i' "
            "WHERE hashed_password IS NULL"
        )
    )

    # 3) Now enforce NOT NULL
    op.alter_column("users", "hashed_password", nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("users", "hashed_password")