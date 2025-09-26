import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import { supabase } from "../supabaseClient"; // Import supabase client
import WebGISMap from "../components/WebGISMap";
import "./ClaimDetailPage.css";

const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-item-label">{label}:</span>
    <span className="detail-item-value">{value || "N/A"}</span>
  </div>
);

function ClaimDetailPage() {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClaim = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("claims")
          .select("*")
          .eq("id", id)
          .single(); // Fetch a single record

        if (error) throw error;
        setClaim(data);
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
      <div className="spinner-container">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading Claim Details...</span>
        </Spinner>
      </div>
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
    <div className="claim-detail-page">
      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Claim Details</h1>
          <p className="page-subtitle">
            Viewing full record for claim ID: <strong>{claim.id}</strong>
          </p>
        </div>

        <Row>
          <Col>
            <Link to="/claims-data">
              <Button variant="primary" className="back-button mb-3">
                <ArrowLeft className="me-2" />
                Back to Claims List
              </Button>
            </Link>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col lg={5} xl={4} className="mb-4 mb-lg-0">
            <Card className="h-100">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Claimant Information</h5>
                  <div
                    className={`status-indicator status-${
                      claim.status || "Pending"
                    }`}
                  >
                    {claim.status || "Pending"}
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <DetailItem label="Name" value={claim.name} />
                <DetailItem label="Village" value={claim.village} />
                <DetailItem label="District" value={claim.district} />
                <DetailItem label="State" value={claim.state} />
                <DetailItem label="Claim Type" value={claim.claim_type} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={7} xl={8}>
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">Geospatial Data</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="map-container-detail">
                  <WebGISMap claims={[claim]} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Raw Extracted Text</h5>
              </Card.Header>
              <Card.Body>
                <pre className="raw-text-container">
                  {claim.raw_text || "No raw text available."}
                </pre>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ClaimDetailPage;
