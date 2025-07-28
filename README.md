# PDF Outline Extractor Round 1A

This project extracts structured heading outlines (Title, H1, H2, H3) from PDF files and saves the results as a JSON file. 
The solution is containerized using Docker to ensure portability and easy execution.

---

## ✅ Approach
- We parse the PDF using `pdfjs-dist`
- Headings are classified into `Title`, `H1`, `H2`, and `H3` based on:
  - Font size
  - Font weight
  - Regex patterns
  - Page position
- The system reads all pages of a PDF, applies logic to detect headings, and outputs a structured `outline.json`.
  
## 🧠 Models / Libraries Used
- **pdfjs-dist** – to extract raw text and metadata from PDF files.
- **pdf-parse** – to quickly access page content.
- **Node.js** and **Express** – backend server to handle the PDF parsing.
- **Docker** – containerization of the app to ensure consistent behavior across systems.

---

## ⚙️ How to Build and Run the Solution
> This runs automatically inside Docker by watching `/app/input/*.pdf` and exporting JSON to `/app/output/`.

## Step 1: Build Docker Image

```bash
docker build -t pdf-extractor-app:final .
docker run -v ${PWD}\input:/app/input -v ${PWD}\output:/app/output -p 3000:3000 pdf-extractor-app:final
```

# Features
- Extracts Title, H1, H2, H3 headings from PDFs
- Persona-based section extraction (Round 1B)
- Outputs clean JSON format with page numbers
- Dockerized backend (CPU-only, ≤200MB)
- Optional frontend UI included (client folder)

# How to Run docker
docker build -t pdf-extractor-app:final .
docker run -v ${PWD}\input:/app/input -v ${PWD}\output:/app/output -p 3000:3000 pdf-extractor-app:final

# how to run client ui
npm install
cd client
npm run dev 

# Round 1 A output
{
  "title": "Clinical Study on Drug XYZ",
  "outline": [
    { "level": "H1", "text": "Introduction", "page": 1 },
    { "level": "H2", "text": "1.1 Study Goals", "page": 1 },
    { "level": "H3", "text": "1.1.1 Background", "page": 1 }
  ]
}
