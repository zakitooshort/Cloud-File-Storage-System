from flask import Flask, request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///files.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(200), nullable=False)
    public_id = db.Column(db.String(100), nullable=False)
    format = db.Column(db.String(10), nullable=False)
    bytes = db.Column(db.Integer, nullable=False)

with app.app_context():
    db.create_all()


@app.route('/files', methods=['GET'])
def get_files():
    files = File.query.all()
    file_list = [{
        'filename':file.filename,
        'url':file.url,
        'public_id':file.public_id,
        'format':file.format,
        'bytes':file.bytes
    } for file in files]
    return jsonify({'files':file_list}),200

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Empty file uploaded'}), 400

    try:
        upload_result = cloudinary.uploader.upload(file, resource_type='auto')
        logger.info('File uploaded to Cloudinary: %s', upload_result)

        new_file = File(
            filename=file.filename,
            url=upload_result['secure_url'],
            public_id=upload_result['public_id'],
            format=upload_result['format'],
            bytes=upload_result['bytes']
        )
        db.session.add(new_file)
        db.session.commit()

        return jsonify({'message': 'File uploaded successfully', 'file': {
            'filename': new_file.filename,
            'url': new_file.url,
            'public_id': new_file.public_id,
            'format': new_file.format,
            'bytes': new_file.bytes
        }}), 200
    except Exception as e:
        logger.error('Error uploading file: %s', str(e))
        return jsonify({'error': str(e)}), 500
    

@app.route('/delete/<name>', methods=['DELETE'])
def delete_file(name):
    try:
        file_to_delete = File.query.filter_by(public_id=name).first()
        if file_to_delete is None:
            return jsonify({'error': 'File not found'}), 404

    
        delete_result = cloudinary.uploader.destroy(name)
        logger.info('Cloudinary delete result: %s',delete_result)  

        if delete_result['result'] == 'ok':
            db.session.delete(file_to_delete)
            db.session.commit()
            return jsonify({'message': 'File deleted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to delete file from Cloudinary'}), 500
    except Exception as e:
        print(f"Error deleting file: {str(e)}")  
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)