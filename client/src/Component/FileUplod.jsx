import { useState, useEffect } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { handleFileLogic } from '../utils/uploadLogic';
import axios from 'axios';
import Loader from './lodder';
import PDFOutlineViewer from './pdfOutlineView';
import toast, { Toaster } from 'react-hot-toast';

function FileUploader() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    const fileArray = Array.from(selectedFiles);
      const validFiles = [];
    try {
      for (let file of fileArray) {
        await handleFileLogic(file, 50);
        validFiles.push(file);
      }
      console.log("Selected Files:");
fileArray.forEach((file, idx) => {
  console.log(`${idx + 1}. ${file.name}`);
});
     setFiles(prev => [...prev, ...validFiles]);  
      console.log("Files saved to state:", fileArray.length);

    } catch (err) {
      
      setError(true);
      setFiles([]);
    }
  };

  if (error) {
    toast.error('Please upload PDF files (max 50MB each)');
    setError(false);
  }

  const uploadFunc = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file[]', files[i]);
    }
   

    try {
      setLoader(true);
      const res = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(res.data)
      setLoader(false);
      setData(res.data);
      toast.success('Converted successfully!');
      setFiles([]);
     
    } catch (err) {
      setLoader(false);
      if (err.response?.data?.message) {
        console.log(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        console.log(err.message);
        toast.error('Server error');
      }
    }
  };



  return (
    <>
      <div className="flex flex-col justify-center items-center mt-6 w-full">
        <Toaster position="top-right" />
        <label
          htmlFor="file-upload"
          className="flex font-mono flex-col items-center justify-center w-[80%] gap-[10px] px-4 py-8 border-4 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition"
        >
          {loader ? (
            <>
              <p className="text-2xl font-semibold text-gray-700">Converting your files...</p>
              <Loader />
            </>
          ) : (
            <>
              <FiUploadCloud className="text-5xl text-blue-500 mb-4" />
              <p className="text-2xl font-semibold text-gray-700">
                {files.length > 0 ? `${files.length} file(s) selected` : 'Choose PDF files to upload'}
              </p>
              <p className="text-sm text-gray-500">Click anywhere or drag & drop</p>



              {files.length > 0 && (
                <button
                  onClick={uploadFunc}
                  className="px-6 py-2 bg-purple-600 text-white mt-4 text-lg cursor-pointer rounded-2xl"
                >
                  Upload & Convert
                </button>
              )}
              <input
                id="file-upload"
                type="file"
                className="hidden"
                multiple accept=".pdf"
                onChange={handleFileChange}
              />
            </>
          )}
        </label>
      </div>

      {data && <PDFOutlineViewer className="w-full" data={data} />}
    </>
  );
}

export default FileUploader;
