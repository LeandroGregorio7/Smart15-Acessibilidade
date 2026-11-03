import tempfile
import unittest
from pathlib import Path

from fastapi import HTTPException
from starlette.datastructures import UploadFile

from app.upload_utils import get_upload_size, save_upload_in_chunks


class UploadStreamingTests(unittest.IsolatedAsyncioTestCase):
    def make_upload(self, data: bytes, size=None) -> UploadFile:
        source = tempfile.SpooledTemporaryFile(max_size=8)
        source.write(data)
        source.seek(0)
        return UploadFile(filename="aerofoto.tif", file=source, size=size)

    async def test_copies_in_small_chunks_and_closes_upload(self):
        payload = b"0123456789abcdef"
        upload = self.make_upload(payload, size=len(payload))

        with tempfile.TemporaryDirectory() as tmpdir:
            target = Path(tmpdir) / "simulation" / "veg.tif"
            copied = await save_upload_in_chunks(
                upload,
                target,
                max_bytes=32,
                chunk_bytes=4,
            )

            self.assertEqual(copied, len(payload))
            self.assertEqual(target.read_bytes(), payload)
            self.assertTrue(upload.file.closed)

    async def test_rejects_file_over_limit_and_removes_partial_target(self):
        upload = self.make_upload(b"123456789", size=9)

        with tempfile.TemporaryDirectory() as tmpdir:
            target = Path(tmpdir) / "too-large.tif"
            with self.assertRaises(HTTPException) as raised:
                await save_upload_in_chunks(
                    upload,
                    target,
                    max_bytes=8,
                    chunk_bytes=4,
                )

            self.assertEqual(raised.exception.status_code, 413)
            self.assertFalse(target.exists())
            self.assertTrue(upload.file.closed)

    async def test_measures_upload_without_declared_size(self):
        payload = b"unknown-size-payload"
        upload = self.make_upload(payload, size=None)
        self.assertEqual(get_upload_size(upload), len(payload))
        await upload.close()


if __name__ == "__main__":
    unittest.main()
