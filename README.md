#  PDF Extractor – Round 1B
This project is a Node.js-powered API designed to intelligently extract structured content from PDF documents and analyze it from a persona-centric viewpoint

# How It Works
When the server is initiated, the system batch-processes all PDFs inside the /input directory. It supports up to 10 large PDFs,
with tested performance on a 1GB batch completing extraction in under 60 seconds.Using pdfjs-dist, each document is parsed,
The first 20 lines are analyzed and condensed into structured output:
section_title: Top-most 1–2 lines judged by font size and layout
Generate persona-based summaries using document structure
refined_text: Preview-style summary merged from surrounding lines
page_number: Source page location
Each document yields individual JSON summaries saved in /output. Data includes both section-level and subsection-level insights for further persona-based relevance scoring.

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
# docker file 
```bash
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./
CMD ["node", "index.js"]
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
