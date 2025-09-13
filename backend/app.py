import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
import uuid

# Import the digitize function from your existing script
from OCR.digitize_fra import digitize_fra_document

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- Supabase Setup ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in the .env file.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- API Endpoints ---

@app.route("/api/upload", methods=["POST"])
def upload_pdf():
    """
    Handles PDF file upload, digitization, and storage in Supabase.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename and file.filename.endswith('.pdf'):
        try:
            # Save the uploaded file temporarily
            upload_folder = 'uploads'
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)
            
            # Use a unique filename to prevent overwrites
            file_extension = os.path.splitext(file.filename)[1]
            temp_file_path = os.path.join(upload_folder, str(uuid.uuid4()) + file_extension)
            file.save(temp_file_path)

            # --- OCR Processing ---
            extracted_data = digitize_fra_document(temp_file_path)

            if not extracted_data:
                return jsonify({"error": "Failed to extract data from the uploaded file."}), 500

            # --- Check for Duplicates ---
            # Before inserting, check if a record with the same raw_text already exists
            existing_claim_response = supabase.table("FRA_Claims").select("id").eq("raw_text", extracted_data.get("raw_text")).execute()
            
            if len(existing_claim_response.data) > 0:
                # Clean up the temporary file
                os.remove(temp_file_path)
                return jsonify({"error": "This document has already been processed and uploaded."}), 409 # 409 Conflict

            # --- Insert into Supabase ---
            claimant_info = extracted_data.get("claimant_info", {})
            claim_details = extracted_data.get("claim_details", {})
            geo_info = extracted_data.get("geographical_info", {}).get("coordinates", {})

            # Convert latitude and longitude to numeric, handle None
            latitude = float(geo_info.get("latitude")) if geo_info.get("latitude") else None
            longitude = float(geo_info.get("longitude")) if geo_info.get("longitude") else None

            data_to_insert = {
                "name": claimant_info.get("name"),
                "village": claimant_info.get("village"),
                "district": claimant_info.get("district"),
                "state": claimant_info.get("state"),
                "claim_type": claim_details.get("type"),
                "status": claim_details.get("status"),
                "latitude": latitude,
                "longitude": longitude,
                "raw_text": extracted_data.get("raw_text")
            }
            
            # Remove None values before insertion
            data_to_insert = {k: v for k, v in data_to_insert.items() if v is not None}

            insert_response = supabase.table("FRA_Claims").insert(data_to_insert).execute()

            # Clean up the temporary file
            os.remove(temp_file_path)

            # Check for insertion errors
            if len(insert_response.data) == 0:
                 return jsonify({"error": "Failed to insert data into Supabase"}), 500

            return jsonify(insert_response.data[0]), 200

        except Exception as e:
            # Clean up in case of error
            if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
                os.remove(temp_file_path)
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Invalid file type, please upload a PDF or image file"}), 400

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

if __name__ == "__main__":
    app.run(debug=True, port=5001)
