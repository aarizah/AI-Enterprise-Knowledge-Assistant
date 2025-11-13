from pathlib import Path
from typing import List
import fitz  # PyMuPDF for PDF text extraction



def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def save_bytes_to_file(dest: Path, data: bytes) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with open(dest, "wb") as f:
        f.write(data)











