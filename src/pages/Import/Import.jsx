import React, { useState } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const Import = () => {
    const [files, setFiles] = useState([]);
    const [jsonData, setJsonData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(0); // Tiến trình tổng

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter((file) => {
            if (file.size > MAX_FILE_SIZE) {
                setMessage(`File ${file.name} is too large. Please upload a smaller file.`);
                return false;
            }
            if (file.type !== 'application/json') {
                setMessage(`File ${file.name} is not a valid JSON file.`);
                return false;
            }
            return true;
        });

        setFiles(validFiles);
        if (validFiles.length > 0) {
            setMessage('');
        }
    };

    const handleImport = async () => {
        setIsLoading(true);
        setMessage('');
        setProgress(0);

        if (jsonData) {
            try {
                const parsedData = JSON.parse(jsonData);
                await sendDataInChunks(parsedData);
            } catch (error) {
                setMessage('Invalid JSON data.');
                setIsLoading(false);
                return;
            }
        } else if (files.length > 0) {
            let totalFiles = files.length;
            for (let i = 0; i < totalFiles; i++) {
                await handleFileUpload(files[i], i + 1, totalFiles);
            }
        } else {
            setMessage('Please provide JSON data or upload JSON files.');
            setIsLoading(false);
            return;
        }
    };

    const sendDataInChunks = async (data) => {
        const chunkSize = 10; // Mỗi lần gửi tối đa 10 phần tử
        const totalChunks = Math.ceil(data.length / chunkSize);

        for (let i = 0; i < totalChunks; i++) {
            const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
            await sendDataToServer(chunk, i + 1, totalChunks);
        }
    };

    const sendDataToServer = async (data, chunkIndex, totalChunks) => {
        try {
            const response = await fetch('http://localhost:3000/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data })
            });

            if (!response.ok) {
                throw new Error('Failed to upload data.');
            }

            const result = await response.json();
            setProgress(((chunkIndex / totalChunks) * 100).toFixed(2)); // Cập nhật tiến trình
            return result;
        } catch (error) {
            setMessage('Error uploading data.');
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (file, fileIndex, totalFiles) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const fileContent = JSON.parse(event.target.result);
                await sendDataInChunks(fileContent);
                setProgress(((fileIndex / totalFiles) * 100).toFixed(2)); // Tiến trình tổng
            } catch (error) {
                setMessage(`Invalid file format or error reading file ${file.name}.`);
                setIsLoading(false);
            }
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        setFiles([]);
        setJsonData('');
        setProgress(0);
        setMessage('');
        setIsLoading(false);
    };

    return (
        <div>
            <h1>Import JSON Data</h1>
            <input
                type="file"
                accept="application/json"
                multiple
                onChange={handleFileChange}
                disabled={isLoading}
            />
            <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder="Or paste JSON data here"
                disabled={isLoading}
                rows="10"
                cols="50"
            />
            <div>
                <button onClick={handleImport} disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Upload'}
                </button>
                {progress >= 99.9 && (
                    <button onClick={handleReset}>
                        Reset and Upload New Data
                    </button>
                )}
            </div>
            {message && <p>{message}</p>}
            {isLoading && (
                <div>
                    <p>Uploading...</p>
                    <progress value={progress} max="100" />
                    <p>{progress}%</p>
                </div>
            )}
        </div>
    );
};

export default Import;
