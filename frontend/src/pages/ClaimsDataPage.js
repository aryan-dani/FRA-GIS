import React, { useState, useEffect, useCallback } from "react";
import { Container, Spinner, Alert, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PlusCircle } from "react-bootstrap-icons";
import axios from "axios";

import ClaimsTable from "../components/ClaimsTable";
import Analytics from "../components/Analytics"; // Import the Analytics component

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
      // Ensure status is at least 'Pending' if not provided
      const claimsWithStatus = response.data.map((claim) => ({
        ...claim,
        status: claim.status || "Pending",
      }));
      setClaims(claimsWithStatus);
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

  const handleStatusChange = async (claimId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/claims/${claimId}/status`, {
        status: newStatus,
      });
      // Refresh claims to show the updated status
      fetchClaims();
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update claim status.");
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tabular Claims Data</h2>
        <Link to="/add-claim">
          <Button variant="primary">
            <PlusCircle className="me-2" />
            Add New Claim Manually
          </Button>
        </Link>
      </div>
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
            <ClaimsTable
              claims={claims}
              loading={loading}
              onStatusChange={handleStatusChange}
            />
          )}
        </Card.Body>
      </Card>

      {/* Analytics Section */}
      <div className="mt-5">
        <Analytics claims={claims} />
      </div>
    </Container>
  );
}

export default ClaimsDataPage;
