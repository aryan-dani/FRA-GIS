import React, { useState, useEffect, useCallback } from "react";
import { Container, Spinner, Alert, Card } from "react-bootstrap";
import axios from "axios";

import ClaimsTable from "../components/ClaimsTable";

const API_URL = "http://localhost:5001";

function ClaimsDataPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/api/claims`);
      setClaims(response.data);
    } catch (error) {
      setError("Failed to fetch claims data. Is the backend server running?");
      console.error("Failed to fetch claims:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Tabular Claims Data</h2>
      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading Claims...</span>
              </Spinner>
            </div>
          ) : (
            <ClaimsTable claims={claims} loading={loading} />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ClaimsDataPage;
