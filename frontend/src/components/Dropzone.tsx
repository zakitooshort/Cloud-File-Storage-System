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
            style={{height: 200,
                border: '2px dashed rgb(24, 243, 0)',
                borderRadius: '25px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: isDragActive ? '#074900' : '#2ba01e',
                cursor: 'pointer',
            }}
        >
            <input {...getInputProps()}/>
            {isDragActive ? (
                <p className='uploadP1'>Drop the file here...</p>
            ) : (
                <p className='uploadP2'>Drag and drop a file here, or click to select a file</p>
            )}
        </div>
    );
};

export default Dropzone;