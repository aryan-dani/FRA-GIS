import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Spinner, ProgressBar } from "react-bootstrap";

const API_URL = "http://localhost:5001";

function UploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setSuccess("");
    setError("");
    setUploadProgress(0);

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      setSuccess(`File processed successfully! Claim ID: ${response.data.id}`);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred during file upload."
      );
    } finally {
      setUploading(false);
      setFile(null); // Reset file input
      e.target.reset(); // Reset form
    }
  };

  return (
    <div className="upload-form">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select PDF or Image File</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.tiff"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </Form.Group>

        {uploading && (
          <ProgressBar
            animated
            now={uploadProgress}
            label={`${uploadProgress}%`}
            className="mb-3"
          />
        )}

        <Button variant="primary" type="submit" disabled={uploading || !file}>
          {uploading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Processing...</span>
            </>
          ) : (
            "Upload and Digitize"
          )}
        </Button>
      </Form>
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mt-3">
          {success}
        </Alert>
      )}
    </div>
  );
}

export default UploadForm;
