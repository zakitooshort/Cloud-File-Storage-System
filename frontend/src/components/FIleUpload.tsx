import React, { useState, useEffect } from 'react';
import Dropzone from './Dropzone';
import { Link, Navigate } from 'react-router-dom';
import Spinner from './spinner';
import axios from 'axios';

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [files, setFiles] = useState<any[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const token = localStorage.getItem('token');

    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/files', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFiles(response.data.files);
        } catch (err) {
            console.error('Error fetching files:', err);
            setError('Failed to fetch files. Please try again.');
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    // Handle file selection via Dropzone
    const handleFileUpload = (file: File) => {
        setFile(file);
        setError(null);

        // Generate a preview for image files
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first!');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        setError(null);
        setMessage(null);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            fetchFiles(); // Refresh the file list
            setFile(null);
            setPreview(null);
        } catch (err) {
            console.error('Error uploading file:', err);
            setError('Failed to upload file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle file deletion
    const handleDelete = async (name: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this file?');
        if (!confirmDelete) return;
        try {
            const response = await axios.delete(`http://localhost:5000/delete/${name}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(response.data.message);
            setFiles((prevFiles) => prevFiles.filter((file) => file.public_id !== name));
        } catch (err) {
            console.error('Error deleting file:', err);
            setError('Failed to delete file. Please try again.');
        }
    };

    // Handle file download
    const handleDownload = async (url: string, name: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error('Error downloading file:', err);
            setError('Failed to download file. Please try again.');
        }
    };

    return (
        <>
            <nav>
                <Link to="/" className="Link">
                    Home
                </Link>
            </nav>
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
                <div className="Uploads">
                    <h2 className="title">Upload an Image</h2>
                    <h2>(of something you've done today, ate ...etc)</h2>
                    <Dropzone onFileUpload={handleFileUpload} />

                    {/* Preview of the selected image */}
                    {preview && (
                        <div
                            style={{
                                marginTop: '20px',
                                border: '1px solid #ddd',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    display: 'block',
                                }}
                            />
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        style={{
                            marginTop: '20px',
                            fontSize: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#2ba01e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                        {loading && <Spinner />}
                    </button>

                    {message && <div style={{ color: '#E3ECCC', marginTop: '10px' }}>{message}</div>}
                    {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                </div>
                <h2 className="title">Your Previous Uploads</h2>
                {files.length === 0 ? (
                    <p>No files uploaded yet.</p>
                ) : (
                    <div className="flex">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: '20px',
                                    border: '1px solid #ddd',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <img
                                    src={file.url}
                                    alt={file.filename}
                                    style={{
                                        width: '100%',
                                        display: 'block',
                                    }}
                                />

                                <div
                                    style={{
                                        backgroundColor: '#fff',
                                        padding: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <button
                                        onClick={() => handleDelete(file.public_id)}
                                        style={{
                                            padding: '10px 20px',
                                            fontSize: '20px',
                                            backgroundColor: '#ff4d4d',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handleDownload(file.url, file.filename)}
                                        style={{
                                            padding: '10px 20px',
                                            fontSize: '20px',
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
             </>
    );
};

export default FileUpload;