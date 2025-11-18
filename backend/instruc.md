### Metadata 
AI/chunking/utils -> Crea metadata base por archivo (por ejemplo `source`, `type`).

AI/chunking/chunking -> Adiciona metadata de estructura Markdown (`h1`,`h2`,`h3`) cuando existe y preserva la metadata previa.

Metadata final (por chunk):
- source: nombre del archivo (ej. `manual.pdf`, `doc.docx`)
- type: tipo de archivo (`pdf`, `docx`, `md`)
- page: número de página REAL, 1-indexed (para `pdf` y `docx`)
- total_pages: total de páginas (para `pdf` y `docx`)
- h1/h2/h3: encabezados detectados (si existen)
- split_id: índice del sub‑chunk generado por el `TokenTextSplitter`

Notas:
- **PDF**: se genera un único `Document` con marcadores de página internos; el `chunking` por headers calcula `page` como la página de inicio del chunk. `total_pages` viene en la metadata del documento.
- **DOCX**: se convierte automáticamente a PDF temporal para obtener paginación REAL y se procesa igual que PDF (un solo `Document` con marcadores). Requiere:
  - Windows: `docx2pdf` (usa Word COM)
  - Linux/Mac: `libreoffice` instalado en el sistema
  - Si no hay conversor, procesa sin `page` (fallback)
- **MD**: no tiene paginación; no incluye `page`.



