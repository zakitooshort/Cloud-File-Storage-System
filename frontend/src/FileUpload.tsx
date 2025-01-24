import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<any[]>([]);

    // Fetch the list of uploaded files
    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/files');
            setFiles(response.data.files);
        } catch (err) {
            console.error('Error fetching files:', err);
        }
    };

    // Fetch files on component mount
    useEffect(() => {
        fetchFiles();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null); // Clear any previous errors
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setError(null); // Clear any previous errors
        setMessage(null); // Clear any previous messages

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message); // Show success message
            fetchFiles(); // Refresh the file list
        } catch (err) {
            console.error('Error uploading file:', err);
            setError('Failed to upload file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <h2>Upload a File</h2>
            <input
                type="file"
                onChange={handleFileChange}
                style={{ margin: '20px 0' }}
            />
            <button
                onClick={handleUpload}
                disabled={uploading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: uploading ? '#ccc' : '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                }}
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>

            {message && (
                <div style={{ color: 'green', marginTop: '10px' }}>
                    {message}
                </div>
            )}

            {error && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    {error}
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <h3>Uploaded Files</h3>
                {files.length === 0 ? (
                    <p>No files uploaded yet.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {files.map((file, index) => (
                            <li key={index} style={{ margin: '10px 0' }}>
                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#007bff', textDecoration: 'none' }}
                                >
                                    {file.filename}
                                </a>
                                <span style={{ marginLeft: '10px', color: '#666' }}>
                                    ({file.format}, {Math.round(file.bytes / 1024)} KB)
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FileUpload;