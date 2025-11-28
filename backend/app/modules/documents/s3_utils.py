"""
Utilidades para manejo de archivos - Infraestructura
"""
from fastapi import UploadFile
from typing import List, Optional
from pathlib import Path
import asyncio


class FileUtils:
    """Manejo de archivos del sistema"""
    
    def __init__(self, base_upload_dir: Path):
        self.upload_dir = base_upload_dir
        self._ensure_upload_dir()
    
    def _ensure_upload_dir(self) -> None:
        """Asegura que el directorio de uploads existe"""
        self.upload_dir.mkdir(parents=True, exist_ok=True)
    
    async def save_uploaded_file(self, file: UploadFile, filename: Optional[str] = None) -> Path:
        """Guarda un archivo subido en el disco"""
        dest_name = filename or file.filename or f"uploaded_{id(file)}"
        dest_path = self.upload_dir / dest_name
        
        data = await file.read()
        dest_path.write_bytes(data)
        
        return dest_path
    
    async def save_uploaded_files(self, files: List[UploadFile]) -> List[Path]:
        """Guarda múltiples archivos subidos"""
        saved_paths = []
        
        for file in files:
            path = await self.save_uploaded_file(file)
            saved_paths.append(path)
        
        return saved_paths
    
    def delete_file(self, file_path: Path) -> bool:
        """Elimina un archivo del sistema"""
        try:
            if file_path.exists():
                file_path.unlink()
                return True
        except Exception as e:
            print(f"Warning: Could not delete file {file_path}: {e}")
        return False
    
    def file_exists(self, file_path: Path) -> bool:
        """Verifica si un archivo existe"""
        return file_path.exists()
    
    def get_file_info(self, file_path: Path) -> dict:
        """Obtiene información de un archivo"""
        if not file_path.exists():
            return {}
        
        stat = file_path.stat()
        return {
            "filename": file_path.name,
            "file_type": file_path.suffix.lower().replace(".", ""),
            "file_size_bytes": stat.st_size,
            "file_path": str(file_path)
        }


# Instancia global para reutilizar
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
UPLOADS_FOLDER = BASE_DIR / "s3"
file_utils = FileUtils(UPLOADS_FOLDER)