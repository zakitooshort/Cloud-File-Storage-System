from flask import Flask, request, jsonify
from flask_cors import CORS  # Enable CORS for cross-origin requests
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os
import logging

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage for uploaded file metadata
uploaded_files = []

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Handle file uploads to Cloudinary.
    """
    # Check if a file is included in the request
    if 'file' not in request.files:
        logger.error('No file uploaded')
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    # Check if the file is empty
    if file.filename == '':
        logger.error('Empty file uploaded')
        return jsonify({'error': 'Empty file uploaded'}), 400

    try:
        # Upload the file to Cloudinary
        logger.info(f'Uploading file: {file.filename}')
        upload_result = cloudinary.uploader.upload(file, resource_type='auto')
        logger.info('File uploaded successfully')

        # Store file metadata
        file_metadata = {
            'filename': file.filename,
            'url': upload_result['secure_url'],
            'public_id': upload_result['public_id'],
            'format': upload_result['format'],
            'bytes': upload_result['bytes']
        }
        uploaded_files.append(file_metadata)

        return jsonify({'message': 'File uploaded successfully', 'file': file_metadata}), 200
    except Exception as e:
        # Log the error and return a 500 response
        logger.error(f'Error uploading file: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/files', methods=['GET'])
def get_files():
    """
    Return the list of uploaded files.
    """
    return jsonify({'files': uploaded_files}), 200

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint to verify the server is running.
    """
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    # Run the Flask app
    logger.info('Starting Flask server...')
    app.run(debug=True)