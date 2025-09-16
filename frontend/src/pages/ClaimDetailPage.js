import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import WebGISMap from "../components/WebGISMap";

const API_URL = "http://localhost:5001";

function ClaimDetailPage() {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClaim = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/claims/${id}`);
        setClaim(response.data);
      } catch (err) {
        setError("Failed to fetch claim details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!claim) {
    return (
      <Container>
        <Alert variant="warning">Claim not found.</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Link to="/claims-data" className="btn btn-secondary mb-3">
            Back to Data Table
          </Link>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h3">Claim Details (ID: {claim.id})</Card.Header>
            <Card.Body>
              <p>
                <strong>Name:</strong> {claim.name || "N/A"}
              </p>
              <p>
                <strong>Village:</strong> {claim.village || "N/A"}
              </p>
              <p>
                <strong>District:</strong> {claim.district || "N/A"}
              </p>
              <p>
                <strong>State:</strong> {claim.state || "N/A"}
              </p>
              <p>
                <strong>Claim Type:</strong> {claim.claim_type || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {claim.status || "N/A"}
              </p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header as="h4">Raw Extracted Text</Card.Header>
            <Card.Body>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  backgroundColor: "#f8f9fa",
                  padding: "1rem",
                  borderRadius: "0.25rem",
                }}
              >
                {claim.raw_text || "No raw text available."}
              </pre>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header as="h4">Claim Area</Card.Header>
            <Card.Body className="p-0">
              <WebGISMap claims={[claim]} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ClaimDetailPage;
