import React from "react";
import { Card } from "react-bootstrap";

function OcrResultDisplay({ rawText, entities }) {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header>
        <h5 className="mb-0">Extracted Information</h5>
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <h6>Key Details</h6>
          <p className="mb-1">
            <strong>Claimant:</strong>{" "}
            {entities?.name || <span className="text-muted">Not found</span>}
          </p>
          <p className="mb-1">
            <strong>Village:</strong>{" "}
            {entities?.village || <span className="text-muted">Not found</span>}
          </p>
          <p className="mb-1">
            <strong>District:</strong>{" "}
            {entities?.district || (
              <span className="text-muted">Not found</span>
            )}
          </p>
        </div>
        <div>
          <h6>Raw Extracted Text</h6>
          <pre className="ocr-raw-text-display">
            {rawText || "No text extracted."}
          </pre>
        </div>
      </Card.Body>
    </Card>
  );
}

export default OcrResultDisplay;
