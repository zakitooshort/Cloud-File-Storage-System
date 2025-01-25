import React, {useState, useEffect} from 'react';

const FileUpload: React.FC = ()=>{
    const [file, setFile] = useState<File | null>(null);
    const [files, setFiles] = useState<any[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchFiles = async () =>{
        try {
            const response = await fetch('http://localhost:5000/files');
            const data = await response.json();
            setFiles(data.files);
        } catch(err){
            console.error('Error fetching files:', err);
        }
    } ;
    useEffect(()=>{
        fetchFiles();
    }, []);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        if (e.target.files && e.target.files[0]){
            setFile(e.target.files[0]);
            setError(null);
        }
    };
    const handleDelete = async (name: string) => {
        console.log('Deleting file with public_id:', name); 
    
        try {
            const response = await fetch(`http://localhost:5000/delete/${name}`, {
                method: 'DELETE',
            });
            console.log('Response:', response); 
    
            const data = await response.json();
            console.log('Response Data:', data); 
    
            if (response.ok) {
                setMessage(data.message);
                setFiles((prevFiles) => prevFiles.filter((file) => file.public_id !== name));
            } else {
                setError(data.error || 'Failed to delete file.');
            }
        } catch (err) {
            console.error('Error deleting file:', err);  
            setError('Failed to delete file. Please try again.');
        }
    };
    const handleDownload = async (url: string, name: string)=>{
        try{
            const response = await fetch(url);
            const blob = await response.blob();

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch(err){
            console.error('Error downloading file:',err);
            setError('Failed to download file. Please try again.');
        }
    };
    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first!');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        console.log('FormData:', formData); 
    
        setError(null); 
        setMessage(null); 
    
        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });
            console.log('Response:', response); 
            const data = await response.json();
            console.log('Response Data:', data); 
            setMessage(data.message); 
        } catch (err) {
            console.error('Error uploading file:', err); 
            setError('Failed to upload file. Please try again.');
        }
    };
    return(
        <div>
            <h2>Upload a File</h2>
            <input type="file" onChange={handleFileChange}/>
            <button onClick={handleUpload}>Upload</button>
            {message && <div style={{color:'green'}}>{message}</div> }
            {error && <div style={{color:'red'}}>{error}</div> }
            <h2>Files</h2>
            {files.length === 0 ? (
                <p>No files uploaded yet.</p>
            ) : (
                <ul>
                    {files.map((file, index) =>(
                        <li key={index}>
                            <a href={file.url} download={file.filename}   target="_blank" rel="noopener noreferrer">
                                {file.filename} 
                            </a>
                            <span>({file.format}, {Math.round(file.bytes / 1024)} KB)  </span>
                            <button onClick={()=> handleDelete(file.public_id)}>Delete</button>
                            <button onClick={()=> handleDownload(file.url, file.name)}>Download</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

}
export default FileUpload;