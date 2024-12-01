import React, { useState } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const Import = () => {
    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(0); // Tiến trình tải lên

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > MAX_FILE_SIZE) {
                setMessage('File is too large. Please upload a smaller file.');
                return;
            }
            if (selectedFile.type !== 'application/json') {
                setMessage('Please select a valid JSON file');
            } else {
                setFile(selectedFile);
                setMessage('');
            }
        }
    };

    const handleImport = async () => {
        setIsLoading(true);
        setMessage('');
        setProgress(0);

        let dataToSend = [];

        // Nếu có dữ liệu JSON trong textarea
        if (jsonData) {
            try {
                dataToSend = JSON.parse(jsonData);
                await sendDataInChunks(dataToSend);
            } catch (error) {
                setMessage('Invalid JSON data');
                setIsLoading(false);
                return;
            }
        }
        // Nếu người dùng tải file lên
        else if (file) {
            await handleFileUpload(file);
        } else {
            setMessage('Please provide JSON data or upload a JSON file');
            setIsLoading(false);
            return;
        }
    };

    const sendDataInChunks = async (data) => {
        const chunkSize = 10; // Mỗi lần gửi tối đa 20 phần tử
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
                throw new Error('Failed to upload data');
            }

            const result = await response.json();
            setProgress(((chunkIndex / totalChunks) * 100).toFixed(2)); // Cập nhật tiến trình
            return result;
        } catch (error) {
            setMessage('Error uploading data');
            setIsLoading(false);
        }
    };

    // Hàm xử lý upload file
    const handleFileUpload = async (file) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const fileContent = JSON.parse(event.target.result);
                await sendDataInChunks(fileContent);
            } catch (error) {
                setMessage('Invalid file format or error reading the file.');
                setIsLoading(false);
            }
        };
        reader.readAsText(file);
    };

    // Hàm reset lại để tải file mới
    const handleReset = () => {
        setFile(null);
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
