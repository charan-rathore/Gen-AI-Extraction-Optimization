import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, List, AlertCircle } from 'lucide-react';

const ExcelColumnExtractor = () => {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const processExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.onload = async () => {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const workbook = window.XLSX.read(arrayBuffer, {
            cellStyles: true,
            cellFormulas: true,
            cellDates: true,
            cellNF: true,
            sheetStubs: true
          });

          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = window.XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

          // Helper function to parse list-like strings into arrays
          const parseListString = (value) => {
            if (!value || typeof value !== 'string') return value;
            
            // Check if the string looks like a list (starts with [ and ends with ])
            const trimmed = value.trim();
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
              try {
                // Replace single quotes with double quotes for valid JSON
                const jsonString = trimmed.replace(/'/g, '"');
                const parsed = JSON.parse(jsonString);
                return Array.isArray(parsed) ? parsed : value;
              } catch (e) {
                // If parsing fails, return original value
                return value;
              }
            }
            return value;
          };

          // Extract columns C, D, E, F and H, I, J, K (indices 2, 3, 4, 5, 7, 8, 9, 10)
          const columnC = [];
          const columnD = [];
          const columnE = [];
          const columnF = [];
          const columnH = [];
          const columnI = [];
          const columnJ = [];
          const columnK = [];

          // Skip header row (index 0) and extract data
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            columnC.push(parseListString(row[2] || ""));
            columnD.push(parseListString(row[3] || ""));
            columnE.push(parseListString(row[4] || ""));
            columnF.push(parseListString(row[5] || ""));
            columnH.push(parseListString(row[7] || ""));
            columnI.push(parseListString(row[8] || ""));
            columnJ.push(parseListString(row[9] || ""));
            columnK.push(parseListString(row[10] || ""));
          }

          resolve({
            columnC,
            columnD,
            columnE,
            columnF,
            columnH,
            columnI,
            columnJ,
            columnK,
            totalRows: columnC.length,
            fileName: file.name
          });
        } catch (error) {
          reject(error);
        }
      };
      script.onerror = () => reject(new Error('Failed to load XLSX library'));
      document.head.appendChild(script);
    });
  };

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    // Check if it's an Excel file
    if (!uploadedFile.name.match(/\.(xlsx|xls)$/)) {
      setError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setFile(uploadedFile);
    setError(null);
    setIsProcessing(true);

    try {
      const result = await processExcelFile(uploadedFile);
      setExtractedData(result);
    } catch (err) {
      setError('Error processing file: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAsText = () => {
    if (!extractedData) return;

    const {
      columnC, columnD, columnE, columnF,
      columnH, columnI, columnJ, columnK,
      fileName, totalRows
    } = extractedData;

    let content = `Extracted Data from: ${fileName}\n`;
    content += `Total Rows: ${totalRows}\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n\n`;
    content += '='.repeat(80) + '\n\n';

    // Helper function to format arrays properly
    const formatArrayOfArrays = (arr, label) => {
      let result = `${label}:\n`;
      result += `[\n`;
      arr.forEach((item, index) => {
        if (Array.isArray(item)) {
          result += `  [${item.map(subItem => `'${subItem}'`).join(', ')}]`;
        } else {
          result += `  '${item}'`;
        }
        if (index < arr.length - 1) result += ',';
        result += '\n';
      });
      result += `]\n\n`;
      return result;
    };

    // Format each column as a proper array of arrays
    content += formatArrayOfArrays(columnC, 'Column C (Expected Event Types)');
    content += formatArrayOfArrays(columnD, 'Column D (Expected Trigger Texts)');
    content += formatArrayOfArrays(columnE, 'Column E (Expected Arguments Roles)');
    content += formatArrayOfArrays(columnF, 'Column F (Expected Argument Texts)');
    content += formatArrayOfArrays(columnH, 'Column H (Event Types)');
    content += formatArrayOfArrays(columnI, 'Column I (Trigger Texts)');
    content += formatArrayOfArrays(columnJ, 'Column J (Argument Roles)');
    content += formatArrayOfArrays(columnK, 'Column K (Argument Texts)');

    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_columns_${fileName.replace(/\.[^/.]+$/, "")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Excel Column Extractor</h1>
        <p className="text-gray-600">Extract columns C, D, E, F and H, I, J, K from your Excel files</p>
        <p className="text-sm text-blue-600 mt-2">✨ Now with automatic list parsing! Converts string lists like "['A', 'B']" to actual arrays</p>
      </div>

      {/* File Upload Section */}
      <div className="mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="mb-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Choose Excel File
              </span>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">
            Upload your .xlsx or .xls file to extract columns C, D, E, F and H, I, J, K
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <span className="text-blue-700">Processing your Excel file...</span>
        </div>
      )}

      {/* Current File Info */}
      {file && !isProcessing && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">
            <strong>File loaded:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        </div>
      )}

      {/* Extracted Data Display */}
      {extractedData && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <List className="mr-2 h-5 w-5" />
              Extraction Summary
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>File:</strong> {extractedData.fileName}
              </div>
              <div>
                <strong>Total Rows:</strong> {extractedData.totalRows}
              </div>
              <div>
                <strong>Columns Extracted:</strong> C, D, E, F, H, I, J, K
              </div>
              <div>
                <strong>Lists Generated:</strong> 8
              </div>
            </div>
          </div>

          {/* Data Preview */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <h3 className="text-lg font-semibold p-4 bg-gray-100 border-b">Data Preview (First 3 entries)</h3>
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {[
                { label: 'Column C (Expected Event Types)', data: extractedData.columnC },
                { label: 'Column D (Expected Trigger Texts)', data: extractedData.columnD },
                { label: 'Column E (Expected Arguments Roles)', data: extractedData.columnE },
                { label: 'Column F (Expected Argument Texts)', data: extractedData.columnF },
                { label: 'Column H (Event Types)', data: extractedData.columnH },
                { label: 'Column I (Trigger Texts)', data: extractedData.columnI },
                { label: 'Column J (Argument Roles)', data: extractedData.columnJ },
                { label: 'Column K (Argument Texts)', data: extractedData.columnK }
              ].map((column, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-800 mb-2">{column.label}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {column.data.slice(0, 3).map((item, i) => (
                      <div key={i} className="bg-gray-50 p-2 rounded text-xs">
                        <strong>Row {i + 1}:</strong> 
                        <div className="ml-2 mt-1">
                          {Array.isArray(item) ? (
                            <div className="font-mono bg-green-100 p-1 rounded">
                              <span className="text-green-700 text-xs">✓ Parsed Array:</span><br/>
                              [
                              {item.map((subItem, idx) => (
                                <span key={idx}>
                                  '{subItem}'{idx < item.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                              ]
                            </div>
                          ) : (
                            <span>{String(item).substring(0, 100)}{String(item).length > 100 ? '...' : ''}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <div className="text-center">
            <button
              onClick={downloadAsText}
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center text-lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Extracted Lists as TXT
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">How to use:</h3>
        <ol className="list-decimal list-inside text-blue-700 space-y-2">
          <li>Upload your Excel file (.xlsx or .xls format)</li>
          <li>The tool will automatically extract columns C, D, E, F and H, I, J, K</li>
          <li>String lists like "['item1', 'item2']" will be converted to actual arrays</li>
          <li>Preview the extracted data to verify it's correct</li>
          <li>Download the results as a formatted text file containing all 8 lists</li>
        </ol>
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
          <p className="text-sm text-green-800">
            <strong>🎯 List Parsing Feature:</strong> This tool now automatically detects and converts string representations of lists (like "['Add', 'Stir']") into actual JavaScript arrays (["Add", "Stir"]). You'll see a green "✓ Parsed Array" indicator in the preview for successfully converted lists.
          </p>
        </div>
        <p className="mt-3 text-sm text-blue-600">
          <strong>Note:</strong> The tool skips the header row and extracts data from row 2 onwards.
        </p>
      </div>
    </div>
  );
};

export default ExcelColumnExtractor;