import os
import json
import re
import pytesseract
from pdf2image import convert_from_path

# Step 1: Define file paths
PDF_FILE = "fra_dummy.pdf"
JSON_FILE = "fra_data.json"
TESSERACT_CMD = r"C:\Program Files\Tesseract-OCR\tesseract.exe"  # Update if Tesseract is elsewhere

# Check if Tesseract is installed
if not os.path.exists(TESSERACT_CMD):
    print(f"Error: Tesseract not found at '{TESSERACT_CMD}'")
    print("Please install Tesseract and/or update the TESSERACT_CMD path in the script.")
    exit()

pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD


def extract_field(pattern, text):
    """Helper function to extract a field using regex"""
    match = re.search(pattern, text, re.IGNORECASE)
    return match.group(1).strip() if match else None


def digitize_fra_document(pdf_path):
    """
    Digitizes a scanned FRA document from a PDF file.
    Args:
        pdf_path (str): Path to the PDF file.
    Returns:
        dict: Extracted structured data.
    """
    if not os.path.exists(pdf_path):
        print(f"Error: PDF file not found at '{pdf_path}'")
        return None

    # Step 2: Convert PDF pages to images
    print("Converting PDF to images...")
    try:
        images = convert_from_path(pdf_path)
    except Exception as e:
        print(f"Error converting PDF to images: {e}")
        print("Please ensure you have Poppler installed and in your PATH.")
        return None

    # Step 3: Use Tesseract OCR to extract raw text
    print("Extracting text with Tesseract OCR...")
    raw_text = ""
    for i, image in enumerate(images):
        print(f"  - Processing page {i+1}...")
        raw_text += pytesseract.image_to_string(image)

    print("\n--- Raw Extracted Text ---")
    print(raw_text)
    print("--------------------------\n")

    # Step 4: Extract fields with regex
    print("Extracting fields with regex...")

    name = extract_field(r"Name\s*of\s*Claimant[:\-]?\s*(.+)", raw_text)
    village = extract_field(r"Village[:\-]?\s*(.+)", raw_text)
    district = extract_field(r"District[:\-]?\s*(.+)", raw_text)
    state = extract_field(r"State[:\-]?\s*(.+)", raw_text)
    claim_type = extract_field(r"Claim\s*Type[:\-]?\s*(.+)", raw_text)
    status = extract_field(r"Status[:\-]?\s*(.+)", raw_text)

    # Regex for coordinates
    coord_match = re.search(r"Coordinates[:\-]?\s*([\d\.-]+)\s*,\s*([\d\.-]+)", raw_text, re.IGNORECASE)
    coordinates = {
        "latitude": coord_match.group(1) if coord_match else None,
        "longitude": coord_match.group(2) if coord_match else None
    }

    # Step 5: Store structured data
    extracted_data = {
        "claimant_info": {
            "name": name,
            "village": village,
            "district": district,
            "state": state
        },
        "claim_details": {
            "type": claim_type,
            "status": status
        },
        "geographical_info": {
            "coordinates": coordinates
        },
        "raw_text": raw_text
    }

    return extracted_data


def main():
    """Main function to run the digitization process."""
    fra_data = digitize_fra_document(os.path.join(os.path.dirname(__file__), PDF_FILE))

    if fra_data:
        print(f"Saving extracted data to {JSON_FILE}...")
        with open(os.path.join(os.path.dirname(__file__), JSON_FILE), "w") as f:
            json.dump(fra_data, f, indent=4)

        print("\n--- Structured JSON Data ---")
        print(json.dumps(fra_data, indent=4))
        print("--------------------------\n")
        print("Digitization complete.")


if __name__ == "__main__":
    main()

