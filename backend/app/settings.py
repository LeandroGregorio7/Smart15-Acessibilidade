import os

TEMP_DIR = os.getenv(
    "SMART15_TEMP_DIR",
    "temp_export"
)

ALLOW_ORIGINS = os.getenv(
    "SMART15_ALLOWED_ORIGINS",
    "*"
).split(",")
