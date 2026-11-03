"""Bounded-memory helpers for multipart file uploads."""

import os
from pathlib import Path

from fastapi import HTTPException
from starlette.datastructures import UploadFile

UPLOAD_COPY_CHUNK_BYTES = 8 * 1024 * 1024


def get_upload_size(upload: UploadFile) -> int | None:
    """Return the uploaded file size without reading its contents into memory."""
    if upload.size is not None:
        return int(upload.size)

    try:
        current_position = upload.file.tell()
        upload.file.seek(0, os.SEEK_END)
        size = upload.file.tell()
        upload.file.seek(current_position, os.SEEK_SET)
        return int(size)
    except (AttributeError, OSError):
        return None


def format_upload_limit(max_bytes: int) -> str:
    limit_gib = max_bytes / (1024**3)
    return f"O limite total de arquivos por simulação é {limit_gib:g} GiB."


async def save_upload_in_chunks(
    upload: UploadFile,
    destination: Path,
    max_bytes: int,
    chunk_bytes: int = UPLOAD_COPY_CHUNK_BYTES,
) -> int:
    """Copy an uploaded file to disk in bounded chunks, never buffering it all in RAM."""
    copied_bytes = 0
    try:
        declared_size = get_upload_size(upload)
        if declared_size is not None and declared_size > max_bytes:
            raise HTTPException(status_code=413, detail=format_upload_limit(max_bytes))

        destination.parent.mkdir(parents=True, exist_ok=True)
        with destination.open("wb") as destination_file:
            while True:
                chunk = await upload.read(chunk_bytes)
                if not chunk:
                    break
                copied_bytes += len(chunk)
                if copied_bytes > max_bytes:
                    raise HTTPException(status_code=413, detail=format_upload_limit(max_bytes))
                destination_file.write(chunk)

        return copied_bytes
    except Exception:
        destination.unlink(missing_ok=True)
        raise
    finally:
        await upload.close()
