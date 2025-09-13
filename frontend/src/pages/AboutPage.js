import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

function AboutPage() {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h2">About the FRA-GIS Platform</Card.Header>
            <Card.Body>
              <Card.Text>
                This platform is a proof-of-concept developed for the Smart
                India Hackathon. Our goal is to address the challenges in
                managing and verifying claims made under The Scheduled Tribes
                and Other Traditional Forest Dwellers (Recognition of Forest
                Rights) Act, 2006.
              </Card.Text>
              <Card.Text>
                By leveraging modern technology, we aim to create a transparent,
                efficient, and accessible system for all stakeholders involved
                in the FRA claims process.
              </Card.Text>
              <hr />
              <h4 className="mt-4">Core Technologies</h4>
              <ul>
                <li>
                  <strong>Frontend:</strong> React with React-Bootstrap for a
                  responsive UI.
                </li>
                <li>
                  <strong>Backend:</strong> A Python-based Flask server to
                  handle business logic.
                </li>
                <li>
                  <strong>OCR:</strong> Tesseract.js for extracting data from
                  scanned documents.
                </li>
                <li>
                  <strong>Database:</strong> Supabase for secure and scalable
                  data storage.
                </li>
                <li>
                  <strong>Mapping:</strong> React-Leaflet to provide interactive
                  geospatial visualizations.
                </li>
              </ul>
              <hr />
              <h4 className="mt-4">Developed by Team Evonex</h4>
              <Card.Text>
                We are a passionate team of developers dedicated to using
                technology to solve real-world problems.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutPage;
