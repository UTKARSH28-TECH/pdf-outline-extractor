import ReactJson from 'react-json-view';


function PDFOutlineViewer({ data }) {

  console.log(data)
  if (!data) return <p>No data to display</p>;


  const handleDownload = () => {
    const fileName = `sampel.json`;
    const jsonStr = JSON.stringify(data, null, 2); 

    const blob = new Blob([jsonStr], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>

      <div style={{ padding: "20px", background: "#f5f5f5", borderRadius: "10px" }}>
      <ReactJson
        src={data}
        name={false}
        collapsed={false}
        enableClipboard={true}
        displayDataTypes={false}
        theme="rjv-default" 
      />
    </div>

      <button
        onClick={handleDownload}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download JSON
      </button>
    </div>
  );
}
export default PDFOutlineViewer