"""
Utilidades para manejo de archivos con Supabase Storage
"""
from fastapi import UploadFile
from typing import List, Optional, Dict
from supabase import create_client, Client
from app.core.environment import settings
import uuid
from pathlib import Path


class SupabaseStorage:
    """Manejo de archivos en Supabase Storage"""
    
    def __init__(self, supabase_url: str, supabase_key: str, bucket_name: str):
        self.client: Client = create_client(supabase_url, supabase_key)
        self.bucket_name = bucket_name
        self._ensure_bucket_exists()
    
    def _ensure_bucket_exists(self) -> None:
        """Verifica que el bucket existe, si no lanza advertencia"""
        try:
            buckets = self.client.storage.list_buckets()
            bucket_exists = any(b.name == self.bucket_name for b in buckets)
            if not bucket_exists:
                print(f"Warning: Bucket '{self.bucket_name}' does not exist in Supabase")
        except Exception as e:
            print(f"Warning: Could not verify bucket existence: {e}")
    
    async def save_uploaded_file(self, file: UploadFile, filename: Optional[str] = None, user_id: Optional[int] = None) -> str:
        """
        Guarda un archivo en Supabase Storage
        Si se proporciona user_id, guarda en carpeta user_<user_id>/filename
        Returns: La ruta del archivo en Supabase (path/to/file.ext)
        """
        base_filename = filename or file.filename or f"uploaded_{uuid.uuid4()}"
        
        # Organizar por usuario si se proporciona user_id
        if user_id:
            dest_name = f"user_{user_id}/{base_filename}"
        else:
            dest_name = base_filename
        
        # Leer el contenido del archivo
        file_content = await file.read()
        
        # Subir a Supabase Storage
        try:
            response = self.client.storage.from_(self.bucket_name).upload(
                path=dest_name,
                file=file_content,
                file_options={"content-type": file.content_type or "application/octet-stream"}
            )
            
            # Retornar la ruta del archivo en Supabase
            return dest_name
        except Exception as e:
            # Si el archivo ya existe, intentar actualizar
            if "duplicate" in str(e).lower() or "already exists" in str(e).lower():
                self.client.storage.from_(self.bucket_name).update(
                    path=dest_name,
                    file=file_content,
                    file_options={"content-type": file.content_type or "application/octet-stream"}
                )
                return dest_name
            raise Exception(f"Error uploading file to Supabase: {e}")
    
    async def save_uploaded_files(self, files: List[UploadFile], user_id: Optional[int] = None) -> List[str]:
        """Guarda múltiples archivos en Supabase Storage"""
        saved_paths = []
        
        for file in files:
            path = await self.save_uploaded_file(file, user_id=user_id)
            saved_paths.append(path)
        
        return saved_paths
    
    def delete_file(self, file_path: str) -> bool:
        """Elimina un archivo de Supabase Storage"""
        try:
            self.client.storage.from_(self.bucket_name).remove([file_path])
            return True
        except Exception as e:
            print(f"Warning: Could not delete file {file_path}: {e}")
            return False
    
    def file_exists(self, file_path: str) -> bool:
        """Verifica si un archivo existe en Supabase Storage"""
        try:
            files = self.client.storage.from_(self.bucket_name).list()
            return any(f['name'] == file_path for f in files)
        except Exception as e:
            print(f"Warning: Could not check file existence: {e}")
            return False
    
    def get_file_info(self, file_path: str) -> Dict:
        """
        Obtiene información de un archivo desde Supabase Storage
        Returns: Dict con filename, file_type, file_size_bytes, file_path, public_url
        """
        try:
            # Obtener la URL pública del archivo
            public_url = self.get_public_url(file_path)
            
            # Extraer información del path
            path_obj = Path(file_path)
            filename = path_obj.name
            file_type = path_obj.suffix.lower().replace(".", "")
            
            # Intentar obtener metadata del archivo
            try:
                # Listar archivos y buscar el que coincida
                files = self.client.storage.from_(self.bucket_name).list()
                matching_file = next((f for f in files if f['name'] == file_path), None)
                file_size = matching_file.get('metadata', {}).get('size', 0) if matching_file else 0
            except:
                file_size = 0
            
            return {
                "filename": filename,
                "file_type": file_type,
                "file_size_bytes": file_size,
                "file_path": file_path,
                "public_url": public_url
            }
        except Exception as e:
            print(f"Warning: Could not get file info for {file_path}: {e}")
            return {}
    
    def get_public_url(self, file_path: str) -> str:
        """Obtiene la URL pública de un archivo"""
        try:
            response = self.client.storage.from_(self.bucket_name).get_public_url(file_path)
            return response
        except Exception as e:
            print(f"Warning: Could not get public URL: {e}")
            return ""
    
    def get_signed_url(self, file_path: str, expires_in: int = 3600) -> str:
        """
        Obtiene una URL firmada temporal para acceso privado
        expires_in: tiempo de expiración en segundos (default 1 hora)
        """
        try:
            response = self.client.storage.from_(self.bucket_name).create_signed_url(
                path=file_path,
                expires_in=expires_in
            )
            return response.get('signedURL', '')
        except Exception as e:
            print(f"Warning: Could not create signed URL: {e}")
            return ""
    
    def download_file(self, file_path: str) -> bytes:
        """Descarga un archivo desde Supabase Storage"""
        try:
            response = self.client.storage.from_(self.bucket_name).download(file_path)
            return response
        except Exception as e:
            raise Exception(f"Error downloading file from Supabase: {e}")


# Instancia global para reutilizar
storage = SupabaseStorage(
    supabase_url=settings.SUPABASE_URL,
    supabase_key=settings.SUPABASE_KEY,
    bucket_name=settings.SUPABASE_BUCKET
)
