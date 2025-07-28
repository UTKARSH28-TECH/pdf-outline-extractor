#  PDF Extractor – Round 1B
This project is a Node.js-powered API designed to intelligently extract structured content from PDF documents and analyze it from a persona-centric viewpoint

# Key Capabilities
- Upload up to 10 PDFs with custom metadata
- Extract document sections and infer content hierarchy
- Generate persona-based summaries using document structure
- Create combined output JSON files with metadata and insights
- 
# How to Run docker
```bash
docker build -t pdf-extractor-app:final .
docker run -v ${PWD}\input:/app/input -v ${PWD}\output:/app/output -p 3000:3000 pdf-extractor-app:final
```

# Round 1 B
```bash
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
```
