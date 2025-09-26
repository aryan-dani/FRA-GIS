import React, { useState, useEffect, useCallback } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../supabaseClient";
import Analytics from "../components/Analytics";
import "./AnalyticsPage.css";

function AnalyticsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.from("FRA_Claims").select("*");
      if (error) throw error;
      setClaims(data);
    } catch (error) {
      setError("Failed to fetch claims data from Supabase.");
      console.error("Failed to fetch claims:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return (
    <div className="analytics-page">
      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Claims Analytics</h1>
          <p className="page-subtitle">
            A detailed breakdown of FRA claims data.
          </p>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="spinner-container">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading Analytics...</span>
            </Spinner>
          </div>
        ) : (
          <Analytics claims={claims} />
        )}
      </Container>
    </div>
  );
}

export default AnalyticsPage;
