import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
import uuid
import spacy
from pdf2image import convert_from_path
import re
import io
from google.cloud import vision
import pytesseract
import cv2

# --- Setup ---
# Load environment variables from .env file
load_dotenv()

# Initialize Flask App
app = Flask(__name__)

# --- CORS Setup ---
# Allow requests from your local frontend and your deployed GitHub Pages site
origins = [
    "http://localhost:3000",
    "https://aryan-dani.github.io"
]
CORS(app, resources={r"/api/*": {"origins": origins}})

# Load spaCy model
nlp = spacy.load("en_core_web_lg")

# Set Tesseract path (used as a fallback)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Google Vision client is automatically configured via GOOGLE_APPLICATION_CREDENTIALS
# Instantiate the client once globally for efficiency
vision_client = vision.ImageAnnotatorClient()

# --- Supabase Setup ---
# Use os.environ.get for deployed environments
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") # Use the SERVICE KEY for backend operations

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Service Key must be set in the environment.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# --- OCR & NER Processing Function ---

def extract_entities_from_text(text):
    """Extracts structured data from raw text using spaCy NER."""
    doc = nlp(text)
    
    entities = {
        "persons": [ent.text for ent in doc.ents if ent.label_ == "PERSON"],
        "locations": [ent.text for ent in doc.ents if ent.label_ in ["GPE", "LOC"]],
        "dates": [ent.text for ent in doc.ents if ent.label_ == "DATE"],
        "organizations": [ent.text for ent in doc.ents if ent.label_ == "ORG"],
    }

    # Use regex for specific patterns like land area (example: "4.5 hectares", "2 acres")
    area_pattern = re.compile(r'(\d+(\.\d+)?)\s*(hectares|hectare|acres|acre)', re.IGNORECASE)
    areas = area_pattern.findall(text)
    entities['land_area'] = [" ".join(match) for match in areas]

    # Simple heuristic to assign primary values
    claimant_name = entities["persons"][0] if entities["persons"] else None
    
    # Filter out common non-village/district names from locations
    generic_locations = {'india', 'state', 'district', 'village'}
    meaningful_locations = [loc for loc in entities["locations"] if loc.lower() not in generic_locations]
    
    village = None
    district = None
    if len(meaningful_locations) > 0:
        village = meaningful_locations[0]
    if len(meaningful_locations) > 1:
        district = meaningful_locations[1]

    return {
        "name": claimant_name,
        "village": village,
        "district": district,
        "raw_entities": entities
    }

def _ocr_with_google_vision(file_path):
    """Performs OCR using Google Vision API."""
    print("Attempting OCR with Google Vision API...")
    text = ""
    if file_path.lower().endswith('.pdf'):
        images_from_path = convert_from_path(file_path)
        for image_pil in images_from_path:
            img_byte_arr = io.BytesIO()
            image_pil.save(img_byte_arr, format='PNG')
            image = vision.Image(content=img_byte_arr.getvalue())
            response = vision_client.annotate_image({'image': image, 'features': [{'type_': vision.Feature.Type.DOCUMENT_TEXT_DETECTION}]})
            if response.error.message:
                raise Exception(f"Google Vision API Error: {response.error.message}")
            text += response.full_text_annotation.text + "\n"
    else:
        with io.open(file_path, 'rb') as image_file:
            content = image_file.read()
        image = vision.Image(content=content)
        response = vision_client.annotate_image({'image': image, 'features': [{'type_': vision.Feature.Type.DOCUMENT_TEXT_DETECTION}]})
        if response.error.message:
            raise Exception(f"Google Vision API Error: {response.error.message}")
        text = response.full_text_annotation.text
    return text

def _preprocess_for_tesseract(image):
    """Preprocesses an image for better Tesseract OCR results."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

def _ocr_with_tesseract(file_path):
    """Performs OCR using Tesseract as a fallback."""
    print("Google Vision failed. Falling back to Tesseract OCR...")
    text = ""
    if file_path.lower().endswith('.pdf'):
        images = convert_from_path(file_path)
        for i, image in enumerate(images):
            temp_image_path = f"temp_tesseract_page_{i}.png"
            image.save(temp_image_path)
            cv_image = cv2.imread(temp_image_path)
            processed_image = _preprocess_for_tesseract(cv_image)
            text += pytesseract.image_to_string(processed_image) + "\n"
            os.remove(temp_image_path)
    else:
        cv_image = cv2.imread(file_path)
        processed_image = _preprocess_for_tesseract(cv_image)
        text = pytesseract.image_to_string(processed_image)
    return text

def digitize_fra_document(file_path):
    """
    Processes a file using Google Vision and falls back to Tesseract on error.
    """
    text = ""
    try:
        # Check if Google credentials are set, otherwise skip to Tesseract
        if os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            text = _ocr_with_google_vision(file_path)
        else:
            raise Exception("Google credentials not found. Skipping to fallback.")
    except Exception as e:
        print(f"An error occurred with Google Vision: {e}")
        text = _ocr_with_tesseract(file_path)

    if not text.strip():
        return None

    extracted_data = extract_entities_from_text(text)
    extracted_data["raw_text"] = text
    
    return extracted_data


# --- API Endpoints ---

@app.route("/api/process-document", methods=["POST"])
def process_document():
    """
    Handles file upload and performs OCR/NER, returning the extracted data without saving.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if not file.filename:
        return jsonify({"error": "No selected file"}), 400

    allowed_extensions = {'.pdf', '.png', '.jpg', '.jpeg', '.tiff'}
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        return jsonify({"error": f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"}), 400

    temp_file_path = ''
    try:
        upload_folder = 'uploads'
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        
        temp_file_path = os.path.join(upload_folder, str(uuid.uuid4()) + file_ext)
        file.save(temp_file_path)

        # --- OCR & NER Processing ---
        extracted_data = digitize_fra_document(temp_file_path)
        
        if not extracted_data or not extracted_data.get("raw_text"):
            return jsonify({"error": "Failed to extract any text from the document."}), 500

        # Return the extracted data for the user to review
        return jsonify(extracted_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Ensure the temporary file is always cleaned up
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.route("/api/claims", methods=["GET"])
def get_claims():
    """
    Fetches all FRA claims from the Supabase database.
    """
    try:
        response = supabase.table("FRA_Claims").select("*").order("id", desc=True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/claims", methods=["POST"])
def create_claim():
    """
    Creates a new claim from user-submitted data (manual or reviewed).
    """
    try:
        claim_data = request.get_json()

        # Basic validation
        if not claim_data or not claim_data.get('name'):
            return jsonify({"error": "Claimant name is required."}), 400

        # --- Check for Duplicates based on raw_text if it exists ---
        if claim_data.get("raw_text"):
            existing_claim_response = supabase.table("FRA_Claims").select("id").eq("raw_text", claim_data["raw_text"]).execute()
            if len(existing_claim_response.data) > 0:
                return jsonify({"error": "This document has already been processed and saved."}), 409

        # Prepare data for insertion
        data_to_insert = {
            "name": claim_data.get("name"),
            "village": claim_data.get("village"),
            "district": claim_data.get("district"),
            "state": claim_data.get("state"),
            "claim_type": claim_data.get("claim_type"),
            "status": claim_data.get("status"),
            "latitude": claim_data.get("latitude"),
            "longitude": claim_data.get("longitude"),
            "raw_text": claim_data.get("raw_text"),
            "entities": claim_data.get("entities")
        }

        data_to_insert = {k: v for k, v in data_to_insert.items() if v is not None}

        insert_response = supabase.table("FRA_Claims").insert(data_to_insert).execute()

        if not insert_response.data:
             return jsonify({"error": "Failed to insert data into Supabase"}), 500

        return jsonify(insert_response.data[0]), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/api/claims/<int:claim_id>", methods=["GET"])
def get_claim_by_id(claim_id):
    """
    Fetches a single FRA claim by its ID.
    """
    try:
        response = supabase.table("FRA_Claims").select("*").eq("id", claim_id).single().execute()
        if response.data:
            return jsonify(response.data), 200
        else:
            return jsonify({"error": "Claim not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/claims/<int:claim_id>/status", methods=["PUT"])
def update_claim_status(claim_id):
    """
    Updates the status of a specific FRA claim.
    """
    data = request.get_json()
    new_status = data.get("status")

    if not new_status:
        return jsonify({"error": "Status is required"}), 400

    try:
        response = supabase.table("FRA_Claims").update({"status": new_status}).eq("id", claim_id).execute()
        
        if response.data:
            return jsonify(response.data[0]), 200
        else:
            # The update might succeed but return no data if the row doesn't exist
            # Let's check if the claim exists first for a better error message
            check_existence = supabase.table("FRA_Claims").select("id").eq("id", claim_id).execute()
            if not check_existence.data:
                return jsonify({"error": "Claim not found"}), 404
            return jsonify({"message": "Status updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
