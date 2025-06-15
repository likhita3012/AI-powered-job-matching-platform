from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
import pdfplumber
import os
import cv2
import fitz  # PyMuPDF
from roboflow import Roboflow
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set Tesseract-OCR path (update this path if needed)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Initialize Roboflow
try:
    rf = Roboflow(api_key="Y10vh3ZwlwXaBpUEcDJ3")
    VERSION = 13
    workspace = rf.workspace()
    project = workspace.project("resume-parse")
    model = project.version(VERSION).model
    logger.info("Roboflow initialized successfully")
except Exception as e:
    logger.error(f"Error initializing Roboflow: {str(e)}")

# Function to preprocess text
def preprocess_text(text):
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text.lower().strip()

# Function to convert PDF pages to images
def convert_pdf_to_images(pdf_path):
    images = []
    try:
        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            pix = doc[page_num].get_pixmap()
            img_path = f"uploads/page_{page_num}.png"
            pix.save(img_path)
            images.append(img_path)
        logger.info(f"Successfully converted PDF to {len(images)} images")
    except Exception as e:
        logger.error(f"Error converting PDF to images: {str(e)}")
    return images

# Function to extract text from resume image using Roboflow
def extract_resume_text(image_path):
    try:
        prediction = model.predict(image_path, confidence=40, overlap=30)
        image = cv2.imread(image_path)
        prediction_data = prediction.json()
        resume_text = ""

        for item in prediction_data.get('predictions', []):
            x1 = int(item['x'] - item['width'] / 2)
            y1 = int(item['y'] - item['height'] / 2)
            x2 = int(item['x'] + item['width'] / 2)
            y2 = int(item['y'] + item['height'] / 2)
            
            cropped_image = image[y1:y2, x1:x2]
            gray_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
            threshold_image = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
            extracted_text = pytesseract.image_to_string(threshold_image)
            resume_text += extracted_text

        return preprocess_text(resume_text)
    
    except Exception as e:
        logger.error(f"Error extracting text from resume: {str(e)}")
        return ""

@app.route('/extract_text', methods=['POST'])
def extract_text():
    try:
        if 'resume' not in request.files:
            logger.error("No file uploaded")
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['resume']
        if file.filename == '':
            logger.error("No selected file")
            return jsonify({'error': 'No selected file'}), 400
        
        # Validate file type
        allowed_extensions = {'.pdf', '.png', '.jpg', '.jpeg'}
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            logger.error(f"Invalid file type: {file_ext}")
            return jsonify({'error': 'Invalid file type. Only PDF, PNG, JPG, and JPEG files are allowed.'}), 400
        
        # Save the file
        file_path = os.path.join("uploads", file.filename)
        file.save(file_path)
        logger.info(f"File saved successfully: {file_path}")
        
        extracted_text = ""
        
        if file.filename.endswith('.pdf'):
            images = convert_pdf_to_images(file_path)
            for img_path in images:
                extracted_text += extract_resume_text(img_path) + "\n"
        else:
            extracted_text = extract_resume_text(file_path)
        
        logger.info("Text extraction completed successfully")
        return jsonify({'extracted_text': extracted_text})
    
    except Exception as e:
        logger.error(f"Error in extract_text endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)