from fastapi import UploadFile
from typing import List, Optional
from app.modules.AI.pipeline.upload.utils import ensure_dir, save_bytes_to_file
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # -> /app/app/modules/AI
uploads_folder = BASE_DIR / "documents" / "uploaded"

async def upload_files (files: List[UploadFile], fileNames: Optional[List[str]] = None):
    ensure_dir(uploads_folder)

    saved_paths: List[Path] = []
    for idx, uf in enumerate(files):
        # Determine destination filename
        name_override = None
        if fileNames and idx < len(fileNames) and fileNames[idx]:
            name_override = fileNames[idx]
        dest_name = name_override or uf.filename or f"uploaded_{idx}"
        dest_path = uploads_folder / dest_name

        # Read and save content
        data = await uf.read()
        save_bytes_to_file(dest_path, data)
        saved_paths.append(dest_path)
        
    return saved_paths