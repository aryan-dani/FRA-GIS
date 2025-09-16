import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  Globe,
  House,
  InfoCircle,
  Speedometer2,
  Table,
  GraphUp, // Import new icon
} from "react-bootstrap-icons";
import "./Navbar.css";

function AppNavbar() {
  return (
    <Navbar
      bg="light"
      variant="light"
      expand="lg"
      className="app-navbar"
      sticky="top"
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="navbar-brand-custom">
          <Globe className="me-2" />
          FRA-GIS Platform
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>
              <House className="me-1" /> Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/dashboard">
              <Speedometer2 className="me-1" /> Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/claims-data">
              <Table className="me-1" /> Data Table
            </Nav.Link>
            {/* Link to Analytics will be handled by the ClaimsDataPage for now */}
            <Nav.Link as={NavLink} to="/about">
              <InfoCircle className="me-1" /> About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
