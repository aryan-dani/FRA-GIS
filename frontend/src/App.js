import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  Container,
  Row,
  Col,
  Navbar,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";
import { CloudUpload, Table, Map } from "react-bootstrap-icons";
import axios from "axios";

import UploadForm from "./components/UploadForm";
import ClaimsTable from "./components/ClaimsTable";
import WebGISMap from "./components/WebGISMap";

const API_URL = "http://localhost:5001";

function App() {
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
    <div className="App">
      <Navbar bg="white" expand="lg" className="app-header" sticky="top">
        <Container fluid>
          <Navbar.Brand href="#home">
            FRA Digitization & Monitoring Dashboard
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="dashboard-container" fluid>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row>
          {/* Left Column: Upload and Map */}
          <Col lg={5} xl={4}>
            <Card className="mb-4">
              <Card.Header>
                <CloudUpload size={20} /> Upload Document
              </Card.Header>
              <Card.Body>
                <UploadForm onUploadSuccess={fetchClaims} />
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <Map size={20} /> Web GIS View
              </Card.Header>
              <Card.Body>
                <WebGISMap claims={claims} />
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column: Claims Table */}
          <Col lg={7} xl={8}>
            <Card>
              <Card.Header>
                <Table size={20} /> All FRA Claims
              </Card.Header>
              <Card.Body>
                {loading && isInitialLoad ? (
                  <div className="spinner-container">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading Claims...</span>
                    </Spinner>
                  </div>
                ) : (
                  <ClaimsTable
                    claims={claims}
                    loading={loading && !isInitialLoad}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <footer className="footer">
        <Container>
          <span>
            Prototype for Smart India Hackathon | Developed by Team Tech-Titans
          </span>
        </Container>
      </footer>
    </div>
  );
}

export default App;
