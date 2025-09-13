import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Map, Table, CloudUpload, CheckCircle } from "react-bootstrap-icons";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <Container fluid className="hero-section text-center text-white">
        <h1 className="display-4">Welcome to the FRA-GIS Platform</h1>
        <p className="lead">
          Digitizing and Mapping Forest Rights Act Claims with Precision and
          Ease.
        </p>
        <Button as={Link} to="/dashboard" variant="primary" size="lg">
          Go to Dashboard
        </Button>
      </Container>

      {/* Features Section */}
      <Container className="features-section">
        <h2 className="text-center mb-5">Platform Features</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center feature-card">
              <Card.Body>
                <CloudUpload size={40} className="feature-icon" />
                <Card.Title>Automated Digitization</Card.Title>
                <Card.Text>
                  Upload scanned FRA documents (PDF or images) and let our OCR
                  engine automatically extract key information, saving time and
                  reducing manual errors.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center feature-card">
              <Card.Body>
                <Map size={40} className="feature-icon" />
                <Card.Title>Geospatial Visualization</Card.Title>
                <Card.Text>
                  View all claims on an interactive map. Each claim is plotted
                  based on extracted coordinates, providing a clear geographical
                  overview.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center feature-card">
              <Card.Body>
                <Table size={40} className="feature-icon" />
                <Card.Title>Centralized Database</Card.Title>
                <Card.Text>
                  All extracted data is stored securely in a centralized
                  database, providing a single source of truth for all FRA
                  claims data.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* How it works Section */}
      <Container className="how-it-works-section">
        <h2 className="text-center mb-5">How It Works</h2>
        <Row className="align-items-center">
          <Col md={6}>
            <img
              src="/workflow-diagram.png" // Placeholder for a diagram
              alt="Workflow diagram"
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6}>
            <ul className="list-unstyled">
              <li className="mb-3">
                <CheckCircle className="me-2" />
                <strong>Upload:</strong> Select a scanned FRA claim document.
              </li>
              <li className="mb-3">
                <CheckCircle className="me-2" />
                <strong>Process:</strong> Our system's OCR extracts text and
                identifies key data points.
              </li>
              <li className="mb-3">
                <CheckCircle className="me-2" />
                <strong>Store:</strong> The structured data is saved to our
                secure Supabase backend.
              </li>
              <li className="mb-3">
                <CheckCircle className="me-2" />
                <strong>Visualize:</strong> The claim appears on the dashboard
                map and in the data table instantly.
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
