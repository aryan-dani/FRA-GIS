import React from "react";
import { Container } from "react-bootstrap";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <Container className="text-center">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} FRA-GIS Platform. All Rights
          Reserved.
        </p>
        <small>A Smart India Hackathon Prototype by Team Evonex</small>
      </Container>
    </footer>
  );
}

export default Footer;
