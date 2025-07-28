const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  res.send('Hello! PDF Extractor');
});

const processPdfFile = async (filePath, persona = '', job = '') => {
  try {
    const pdfData = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    let allItems = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      content.items.forEach(item => {
        const text = item.str.trim();
        if (!text || text.length < 2) return;

        const [a, b, , , x, y] = item.transform;
        const fontSize = Math.sqrt(a ** 2 + b ** 2);

        allItems.push({
          text,
          fontSize,
          x: Math.floor(x),
          y: Math.floor(y),
          page: pageNum
        });
      });
    }

    const grouped = {};
    allItems.forEach(item => {
      const key = `${item.page}_${item.y}_${item.fontSize}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item.text);
    });

    const mergedLines = Object.entries(grouped).map(([key, texts]) => {
      const [page, y, fontSize] = key.split('_');
      return {
        text: texts.join(' ').trim(),
        fontSize: parseFloat(fontSize),
        y: parseInt(y),
        page: parseInt(page)
      };
    });

  
    const maxFontSize = Math.max(...mergedLines.map(line => line.fontSize));

    const h1Headings = mergedLines
      .filter(line => {
        const wordCount = line.text.trim().split(/\s+/).length;
        return (
          line.fontSize === maxFontSize &&
          wordCount >= 3 &&
          wordCount <= 12
        );
      })
      .map(line => ({
        level: "H1",
        text: line.text,
        page: line.page
      }));

    const h2_patterns = [
      /^\d+\.\d+\s+[A-Z][^\.]{10,100}$/,
      /^[A-Z][a-zA-Z\s\-]{5,60}$/,
      /^[A-Z\s]{5,50}$/
    ];

    const h3_patterns = [
      /^\d{1,2}\.\d{1,2}\.\d{1,2}\s+[A-Z][A-Za-z0-9\s,():\-]{5,80}[^\s]?$/,
      /^([•\-*])\s+[A-Z][A-Za-z0-9\s,():\-]{3,80}$/,
      /^(\d+[\.\)]|\([a-zA-Z]\))\s+[A-Z][A-Za-z0-9\s,():\-]{3,80}$/
    ];

    const h2Headings = mergedLines
      .filter(line => h2_patterns.some(pattern => pattern.test(line.text)))
      .map(line => ({
        level: "H2",
        text: line.text,
        page: line.page
      }));

    const h3Headings = mergedLines
      .filter(line => h3_patterns.some(pattern => pattern.test(line.text)))
      .map(line => ({
        level: "H3",
        text: line.text,
        page: line.page
      }));

    const allHeadings = [...h1Headings, ...h2Headings, ...h3Headings];

    allHeadings.sort((a, b) => {
      if (a.page !== b.page) {
        return a.page - b.page;
      } else {
        return b.y - a.y;
      }
    });

    const jsonOutput = {
      title: h1Headings[0]?.text || "Untitled Document",
      outline: allHeadings,
      persona: persona,
      job: job
    };

    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const baseName = path.parse(filePath).name;
    const outputFilePath = path.join(outputDir, baseName + '.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonOutput, null, 2));
    console.log('JSON output saved at:', outputFilePath);

   return {
  ...jsonOutput,
  numPages: pdf.numPages,
};

  } catch (error) {
    console.error("PDF parsing failed for file:", filePath, error);
    throw error;
  }
  
};

const inputDir = path.join(__dirname, 'input');
fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error('Failed to read input directory:', err);
    return;
  }

  files.filter(f => f.endsWith('.pdf')).forEach(pdfFile => {
    const fullPath = path.join(inputDir, pdfFile);
    processPdfFile(fullPath);
  });
});

app.post('/upload', upload.array('file[]', 10), async (req, res) => {
  const persona = req.body.persona || '';
  const job = req.body.job || '';

  const extractedSections = [];
  const subsectionAnalysis = [];
  const headingPayload = [];
  const pdfResults = [];

  try {
    for (const file of req.files) {
      console.log("Processing file:", file.originalname);
      const pdfResult = await processPdfFile(file.path, persona, job);
      fs.unlinkSync(file.path);

      pdfResults.push(pdfResult); 

      extractedSections.push({
        document: file.originalname,
        section_title: pdfResult.title,
        importance_rank: extractedSections.length + 1,
        page_number: pdfResult.outline[0]?.page || 1
      });

      subsectionAnalysis.push({
        document: file.originalname,
        refined_text: `Summary of ${pdfResult.title}...`, 
        page_number: pdfResult.outline[0]?.page || 1
      });

      headingPayload.push({
        document: file.originalname,
        title: pdfResult.title,
        headings: pdfResult.outline || []
      });
    }

    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const combinedOutput = {
      metadata: {
        input_documents: req.files.map(f => f.originalname),
        persona,
        job_to_be_done: job,
        processing_timestamp: new Date().toISOString()
      },
      extracted_sections: extractedSections,
      subsection_analysis: subsectionAnalysis
    };

    fs.writeFileSync(
      path.join(outputDir, "combined_output.json"),
      JSON.stringify(combinedOutput, null, 2)
    );

    res.json(headingPayload);

  } catch (error) {
    console.error("Error during PDF processing:", error);
    res.status(500).json({ error: "Failed to parse PDFs" });
  }
});





app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
