import React, { useState, useEffect } from 'react';
import Dropzone from './Dropzone';
import { Link } from 'react-router-dom';
import Spinner from './spinner'

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [files, setFiles] = useState<any[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [caption, setCaption] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch the list of uploaded files
    const fetchFiles = async () => {
        try {
            const response = await fetch('http://localhost:5000/files');
            const data = await response.json();
            setFiles(data.files);
        } catch (err) {
            console.error('Error fetching files:', err);
        }
    };

    // Fetch files on component mount
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
        formData.append('caption', caption); // Include the caption in the upload

        setError(null); // Clear any previous errors
        setMessage(null); // Clear any previous messages

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setMessage(data.message); // Show success message
            fetchFiles(); // Refresh the file list
            setFile(null); // Clear the selected file
            setPreview(null); // Clear the preview
            setCaption(''); // Clear the caption
        } catch (err) {
            console.error('Error uploading file:', err);
            setError('Failed to upload file. Please try again.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Handle file deletion
    const handleDelete = async (name: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this file?');
        if (!confirmDelete) return;
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/delete/${name}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setFiles((prevFiles) => prevFiles.filter((file) => file.public_id !== name));
            } else {
                setError(data.error || 'Failed to delete file.');
            }
        } catch (err) {
            console.error('Error deleting file:', err);
            setError('Failed to delete file. Please try again.');
        } finally {
            setLoading(false); // Stop loading
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
                <Link to="/">Home</Link>
            </nav>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
                <h2>Upload an Image</h2>
                <Dropzone onFileUpload={handleFileUpload} />

                {/* Preview of the selected image */}
                {preview && (
                    <div style={{
                        marginTop: '20px',
                        border: '1px solid #ddd',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{
                                width: '100%',
                                display: 'block',
                            }}
                        />

                        {/* Caption Input */}
                        <div style={{ padding: '10px' }}>
                            <input
                                type="text"
                                placeholder="Add a caption..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                style={{
                                    width: '80%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ddd',
                                    marginBottom: '10px',
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={loading}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Uploading...' : 'Upload'}
                    {loading && <Spinner />}
                </button>

                {/* Display messages and errors */}
                {message && <div style={{ color: 'green', marginTop: '10px' }}>{message}</div>}
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

                {/* Display uploaded files as Instagram-like posts */}
                <h2>Your Previous Uploads</h2>
                {files.length === 0 ? (
                    <p>No files uploaded yet.</p>
                ) : (
                    <div>
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
                                {/* Image */}
                                <img
                                    src={file.url}
                                    alt={file.filename}
                                    style={{
                                        width: '100%',
                                        display: 'block',
                                    }}
                                />

                                {/* Caption (if available) */}
                                <div style={{ padding: '10px', textAlign: 'left' }}>
                                    <p style={{ margin: '0', fontSize: '14px', color: '#333' }}>
                                        {file.caption || 'No caption'}
                                    </p>
                                </div>

                                {/* Action Buttons (Delete and Download) */}
                                <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                    <button
                                        onClick={() => handleDelete(file.public_id)}
                                        style={{
                                            padding: '5px 10px',
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
                                            padding: '5px 10px',
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