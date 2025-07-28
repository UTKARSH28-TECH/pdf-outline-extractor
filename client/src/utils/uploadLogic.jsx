import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';

GlobalWorkerOptions.workerSrc = workerSrc;

export const handleFileLogic = async (file, maxPages = 50) => {
  if (!file || file.type !== 'application/pdf') {
    throw new Error('Invalid file: Please upload a PDF.');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const typedarray = new Uint8Array(arrayBuffer);

    const pdf = await getDocument({ data: typedarray }).promise;

    if (pdf.numPages > maxPages) {
      throw new Error(`PDF has too many pages. Max allowed is ${maxPages}.`);
    }

    return true;
  } catch (error) {
    console.error("PDF processing error:", error);
    throw error; 
  }
};
