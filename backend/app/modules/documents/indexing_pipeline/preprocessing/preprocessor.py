"""
Preprocesador de documentos - Capa técnica
"""
from pathlib import Path
from typing import List, Dict
from .file_processors import process_docx, process_md, process_pdf


class Preprocessor:
    """Extrae y convierte contenido de documentos a formato estándar"""
    
    SUPPORTED_EXTENSIONS = {
        ".pdf": process_pdf,
        ".docx": process_docx,
        ".md": process_md
    }
    
    def process_files(self, file_paths: List[Path]) -> Dict[str, List]:
        """
        Procesa una lista de archivos y extrae su contenido
        
        Args:
            file_paths: Lista de rutas de archivos
            
        Returns:
            Dict con filename como key y lista de Documents como value
        """
        results = {}
        
        for file_path in file_paths:
            if not file_path.exists() or not file_path.is_file():
                print(f"File does not exist or is not a file: {file_path}")
                continue
            
            filename = file_path.name
            ext = file_path.suffix.lower()
            
            if ext in self.SUPPORTED_EXTENSIONS:
                processor_func = self.SUPPORTED_EXTENSIONS[ext]
                try:
                    documents = processor_func(file_path)
                    results[filename] = documents
                except Exception as e:
                    print(f"Error processing {filename}: {e}")
                    results[filename] = []
            else:
                print(f"Unsupported file type: {filename}")
                results[filename] = []
        
        return results
    
    def is_supported_file(self, file_path: Path) -> bool:
        """Verifica si el tipo de archivo está soportado"""
        return file_path.suffix.lower() in self.SUPPORTED_EXTENSIONS