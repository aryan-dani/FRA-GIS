import React, { useState, useEffect, useCallback } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

import ClaimsTable from "../components/ClaimsTable";
import "./ClaimsDataPage.css";

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
      // Re-fetch claims to show the updated status
      fetchClaims();
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update claim status.");
    }
  };

  return (
    <div className="claims-data-page">
      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Claims Database</h1>
          <p className="page-subtitle">
            Search, filter, and manage all digitized claims.
          </p>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
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
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ClaimsDataPage;
