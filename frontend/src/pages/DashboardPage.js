import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Spinner, Alert, Card } from "react-bootstrap";
import { CloudUpload, Table, Map } from "react-bootstrap-icons";
import axios from "axios";

import UploadForm from "../components/UploadForm";
import ClaimsTable from "../components/ClaimsTable";
import WebGISMap from "../components/WebGISMap";

const API_URL = "http://localhost:5001";

function DashboardPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchClaims = useCallback(async () => {
    if (!isInitialLoad) setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/api/claims`);
      setClaims(response.data);
    } catch (error) {
      setError("Failed to fetch claims. Is the backend server running?");
      console.error("Failed to fetch claims:", error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return (
    <Container className="dashboard-container" fluid>
      <h2 className="mb-4">Claims Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {/* Left Column: Upload Form */}
        <Col lg={4}>
          <Card className="mb-4 mb-lg-0">
            <Card.Header>
              <CloudUpload size={20} /> Upload New FRA Document
            </Card.Header>
            <Card.Body>
              <UploadForm onUploadSuccess={fetchClaims} />
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Web GIS Map */}
        <Col lg={8}>
          <Card>
            <Card.Header>
              <Map size={20} /> Geographical Claims View
            </Card.Header>
            <Card.Body className="p-0">
              {loading && isInitialLoad ? (
                <div className="spinner-container">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading Map...</span>
                  </Spinner>
                </div>
              ) : (
                <WebGISMap claims={claims} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardPage;
