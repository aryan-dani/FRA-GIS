# FRA-GIS Project Progress

This document tracks the progress of the Forest Rights Act (FRA) Digitization & GIS-DSS Prototype.

## Phase 1: Document Digitization (OCR & NER)

- **Status:** In Progress
- **Completed:**
  - [x] Basic document upload (PDF/image) and text extraction using Tesseract OCR.
  - [x] Scanned text is saved to the database.
- **In Progress:**
  - [ ] Implementing Named Entity Recognition (NER) with spaCy to extract structured data (claimant name, village, dates, land area).
  - [ ] Updating the database schema to store structured entities.
  - [ ] Refining the OCR process with image preprocessing for better accuracy.
- **To Do:**
  - [ ] Train a custom NER model if pre-trained models are insufficient for FRA-specific terms.

## Phase 2: GIS Mapping – Building the FRA Atlas

- **Status:** Completed
- **Completed:**
  - [x] Created an interactive map using Leaflet.js.
  - [x] Displaying claim locations from the database as markers.
  - [x] Implemented popups to show basic claim information.
  - [x] Enhanced map with darker markers and polygon areas.
  - [x] Added a dedicated "Claim Detail" page with a map view for a single claim.

## Phase 3: Asset Mapping (Satellite Imagery & Classification)

- **Status:** Not Started
- **To Do:**
  - [ ] Select a sample region in Google Earth Engine (GEE).
  - [ ] Fetch satellite imagery (Landsat/Sentinel).
  - [ ] Perform supervised classification to identify land use (forest, farm, water).
  - [ ] Export the classified layer and overlay it on the Leaflet map.

## Phase 4: Web-Based Interface (Frontend & Backend)

- **Status:** Completed
- **Completed:**
  - [x] Developed a multi-page frontend using React.
  - [x] Created a backend server using Flask.
  - [x] Implemented API endpoints for file uploads and data retrieval.
  - [x] Built a professional UI with navigation, a dashboard, and data tables.
  - [x] Added an analytics dashboard with charts.

## Phase 5: Decision Support System (Rule-Based Recommendations)

- **Status:** Not Started
- **To Do:**
  - [ ] Define a set of rules for scheme eligibility.
  - [ ] Create a database/dictionary of available schemes and their criteria.
  - [ ] Implement a rule engine in the backend to match claimants to schemes.
  - [ ] Create an API endpoint to serve recommendations.
  - [ ] Display recommendations on the claim detail page in the UI.
