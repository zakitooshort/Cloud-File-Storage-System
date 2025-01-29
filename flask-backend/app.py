from flask import Flask, request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
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

app.config['JWT_SECRET_KEY']=os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///files.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    files = db.relationship('File', backref='user', lazy=True)  # Relationship


class File(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(200), nullable=False)
    public_id = db.Column(db.String(100), nullable=False)
    format = db.Column(db.String(10), nullable=False)
    bytes = db.Column(db.Integer, nullable=False)

with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({"message":"User already exists"});400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)   
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message":"User registered successfully"}),201


@app.route('/login', methods=['POST'])
def login():
    data=request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        access_token =create_access_token(identity=username)
        return jsonify({"access_token":access_token}),200
    
    return jsonify({"message":"invalid credentials"}),401

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message":f"Hello , {current_user}!"}),200

@app.route('/files', methods=['GET'])
@jwt_required()
def get_files():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    files = File.query.filter_by(user_id=user.id).all()
    file_list = [{
        'filename': file.filename,
        'url': file.url,
        'public_id': file.public_id,
        'format': file.format,
        'bytes': file.bytes,
    } for file in files]

    return jsonify({'files': file_list}), 200

@app.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    current_user = get_jwt_identity()
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
            bytes=upload_result['bytes'],
            user_id=User.query.filter_by(username=current_user).first().id 
       )
        db.session.add(new_file)
        db.session.commit()

        return jsonify({'message': 'File uploaded successfully', 'file': {
            'filename': new_file.filename,
            'url': new_file.url,
            'public_id': new_file.public_id,
            'format': new_file.format,
            'bytes': new_file.bytes,
        }}), 200
    except Exception as e:
        logger.error('Error uploading file: %s', str(e))
        return jsonify({'error': str(e)}), 500
    

@app.route('/delete/<name>', methods=['DELETE'])
@jwt_required()
def delete_file(name):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        file_to_delete = File.query.filter_by(public_id=name, user_id=user.id).first()
        if file_to_delete is None:
            return jsonify({'error': 'File not found or unauthorized'}), 404

        delete_result = cloudinary.uploader.destroy(name)
        logger.info('Cloudinary delete result: %s', delete_result)

        if delete_result['result'] == 'ok':
            db.session.delete(file_to_delete)
            db.session.commit()
            return jsonify({'message': 'File deleted successfully'}), 200
        else:
            return jsonify({'error': 'Failed to delete file from Cloudinary'}), 500
    except Exception as e:
        logger.error('Error deleting file: %s', str(e))
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)