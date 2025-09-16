import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  Speedometer2,
  Table,
  BarChartLine,
  ArrowRight,
} from "react-bootstrap-icons";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="homepage">
      <Container className="text-center welcome-section">
        <h1 className="display-4">FRA-GIS Platform</h1>
        <p className="lead text-muted">
          A unified platform for managing Forest Rights Act claims data.
        </p>
      </Container>

      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Row>
              <Col md={4} className="mb-4">
                <Card as={Link} to="/dashboard" className="action-card">
                  <Card.Body>
                    <div className="action-icon">
                      <Speedometer2 size={30} />
                    </div>
                    <Card.Title>Dashboard</Card.Title>
                    <Card.Text>
                      Visualize claims and upload documents.
                    </Card.Text>
                    <div className="go-arrow">
                      <ArrowRight />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card as={Link} to="/claims-data" className="action-card">
                  <Card.Body>
                    <div className="action-icon">
                      <Table size={30} />
                    </div>
                    <Card.Title>Claims Data</Card.Title>
                    <Card.Text>
                      Manage, filter, and review all claims.
                    </Card.Text>
                    <div className="go-arrow">
                      <ArrowRight />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card as={Link} to="/analytics" className="action-card">
                  <Card.Body>
                    <div className="action-icon">
                      <BarChartLine size={30} />
                    </div>
                    <Card.Title>Analytics</Card.Title>
                    <Card.Text>Explore trends and data insights.</Card.Text>
                    <div className="go-arrow">
                      <ArrowRight />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
