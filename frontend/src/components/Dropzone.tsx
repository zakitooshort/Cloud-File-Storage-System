import React from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
    onFileUpload: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileUpload }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFileUpload(acceptedFiles[0]); 
            }
        },
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif'], 
        },
        maxFiles: 1, 
    });

    return (
        <div
            {...getRootProps()}
            style={{
                border: '2px dashed #007bff',
                borderRadius: '5px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: isDragActive ? '#f0f8ff' : 'white',
                cursor: 'pointer',
            }}
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the file here...</p>
            ) : (
                <p>Drag and drop a file here, or click to select a file</p>
            )}
        </div>
    );
};

export default Dropzone;