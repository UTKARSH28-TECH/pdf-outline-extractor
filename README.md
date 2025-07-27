# PDF Intelligence Engine — Adobe Hackathon 2025
This repository contains solutions for **Round 1A** and **Round 1B** of the Adobe India Hackathon 2025.  
It extracts structured outlines from PDFs and performs persona-driven content analysis across document collections.

# Features
- Extracts Title, H1, H2, H3 headings from PDFs
- Persona-based section extraction (Round 1B)
- Outputs clean JSON format with page numbers
- Dockerized backend (CPU-only, ≤200MB)
- Optional frontend UI included (client folder)
  
# Folder Structure
pdf-outline-extractor/ ├── input/ ← PDFs for testing ├── output/ ← JSON results ├── server/ ← Node.js backend │ ├── index.js ← Mode switcher │ ├── round1a.js ← Outline extractor │ └── round1b.js ← Persona extractor ├── client/ ← UI (optional for Round 2) ├── Dockerfile ← Docker config └── README.md ← You’re reading it!

# How to Run docker
docker build -t pdf-extractor-app:final .
docker run -v ${PWD}\input:/app/input -v ${PWD}\output:/app/output -p 3000:3000 pdf-extractor-app:final

# how to run client ui
cd client
npm run dev

# Round 1 A output
{
  "title": "Understanding AI",
  "outline": [
    { "level": "H1", "text": "Introduction", "page": 1 },
    { "level": "H2", "text": "Applications", "page": 3 }
  ]
}

# Round 1 B
json
{
  "metadata": {
    "persona": "Travel Planner",
    "job_to_be_done": "Plan a trip"
  },
  "extracted_sections": [
    { "document": "guide1.pdf", "section_title": "Day 1 Itinerary", "page_number": 2 }
  ],
  "subsection_analysis": [
    { "document": "guide1.pdf", "refined_text": "Explore Nice and Cannes.", "page_number": 2 }
  ]
}
