import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

import UploadForm from "../components/UploadForm";
import WebGISMap from "../components/WebGISMap";
import DashboardStats from "../components/DashboardStats";
import "./DashboardPage.css";

const API_URL = "http://localhost:5001";

function DashboardPage() {
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
      setError("Failed to fetch claims. Is the backend server running?");
      console.error("Failed to fetch claims:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const stats = {
    totalClaims: claims.length,
    claimsInReview: claims.filter((c) => c.status === "Pending").length,
    claimsApproved: claims.filter((c) => c.status === "Approved").length,
  };

  return (
    <div className="dashboard-page">
      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Claims Dashboard</h1>
          <p className="page-subtitle">
            An overview of all digitized FRA claims.
          </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="spinner-container">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading Dashboard...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <DashboardStats stats={stats} />
            <Row>
              <Col lg={8} className="mb-4 mb-lg-0">
                <div className="card shadow-sm h-100">
                  <div className="card-header">
                    <h2 className="h5 mb-0">Geographical Claims View</h2>
                  </div>
                  <div className="card-body p-0">
                    <WebGISMap claims={claims} />
                  </div>
                </div>
              </Col>
              <Col lg={4}>
                <div className="card shadow-sm">
                  <div className="card-header">
                    <h2 className="h5 mb-0">Upload New Document</h2>
                  </div>
                  <div className="card-body">
                    <UploadForm onUploadSuccess={fetchClaims} />
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
}

export default DashboardPage;
