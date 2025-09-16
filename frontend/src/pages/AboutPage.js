import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./AboutPage.css";

function AboutPage() {
  return (
    <div className="about-page">
      <Container className="py-5">
        <div className="page-header">
          <h1 className="page-title">About The Platform</h1>
          <p className="page-subtitle">
            Digitizing Forest Rights Act claims with modern technology.
          </p>
        </div>
        <Row className="justify-content-center">
          <Col md={9}>
            <Card>
              <Card.Header>
                <h2>FRA-GIS: A Smart India Hackathon Project</h2>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  This platform is a proof-of-concept developed to address the
                  challenges in managing and verifying claims made under The
                  Scheduled Tribes and Other Traditional Forest Dwellers
                  (Recognition of Forest Rights) Act, 2006.
                </Card.Text>
                <Card.Text>
                  By leveraging modern technology, we aim to create a
                  transparent, efficient, and accessible system for all
                  stakeholders involved in the FRA claims process.
                </Card.Text>
                <hr />
                <h4 className="mt-4">Core Technologies</h4>
                <ul>
                  <li>
                    <strong>Frontend:</strong> A responsive and interactive UI
                    built with React and React-Bootstrap.
                  </li>
                  <li>
                    <strong>Backend:</strong> A robust Python-based Flask server
                    to handle business logic and data processing.
                  </li>
                  <li>
                    <strong>OCR Engine:</strong> Google Vision API for
                    high-accuracy data extraction, with Tesseract as a fallback.
                  </li>
                  <li>
                    <strong>Database:</strong> Secure and scalable data storage
                    powered by Supabase.
                  </li>
                  <li>
                    <strong>Mapping:</strong> Interactive geospatial
                    visualizations using React-Leaflet.
                  </li>
                </ul>
                <hr />
                <h4 className="mt-4">
                  Developed by <span className="team-name">Team Evonex</span>
                </h4>
                <Card.Text>
                  We are a passionate team of developers dedicated to using
                  technology to solve real-world problems and create impactful
                  solutions.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AboutPage;
