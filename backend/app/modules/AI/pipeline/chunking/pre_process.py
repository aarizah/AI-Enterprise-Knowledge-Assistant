from pathlib import Path
from typing import List
from app.modules.AI.pipeline.chunking.utils import process_docx, process_md, process_pdf


def process_files(file_paths: List[Path]):
    """
    Process a list of file paths.
    
    Args:
        file_paths: List of Path objects pointing to files to process
    
    Returns:
        Dictionary with filename as key and list of Document objects as value
    """
    results = {}
    
    # Process each file in the list
    for file in file_paths:
        if not file.exists() or not file.is_file():
            print(f"File does not exist or is not a file: {file}")
            continue
            
        ext = file.suffix.lower()
        if ext == ".pdf":
            results[file.name] = process_pdf(file)
        elif ext == ".docx":
            results[file.name] = process_docx(file)
        elif ext == ".md":
            results[file.name] = process_md(file)
        else:
            print(f"Unsupported file type: {file.name}")

    return results

    # Show first 500 characters of results. Example for one specific file
    #if "Manual_Politicas_Corporativas.docx" in results:
    #    doc_example = results["Manual_Politicas_Corporativas.docx"][0]
    #    print("Metadata:", doc_example.metadata)
    #    print("Texto:", doc_example.page_content[:500])