import React, { useState, useEffect, useCallback } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../supabaseClient"; // Import supabase client

import ClaimsTable from "../components/ClaimsTable";
import "./ClaimsDataPage.css";

function ClaimsDataPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.from("claims").select("*");
      if (error) throw error;

      const claimsWithStatus = data.map((claim) => ({
        ...claim,
        status: claim.status || "Pending",
      }));
      setClaims(claimsWithStatus);
    } catch (error) {
      setError("Failed to fetch claims data. Check RLS policies in Supabase.");
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleStatusChange = async (claimId, newStatus) => {
    try {
      const { error } = await supabase
        .from("claims")
        .update({ status: newStatus })
        .eq("id", claimId);

      if (error) throw error;

      // Re-fetch claims to show the updated status
      fetchClaims();
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update claim status.");
    }
  };

  return (
    <div className="claims-data-page">
      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Claims Database</h1>
          <p className="page-subtitle">
            Search, filter, and manage all digitized claims.
          </p>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
              <div className="spinner-container">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading Claims...</span>
                </Spinner>
              </div>
            ) : (
              <ClaimsTable
                claims={claims}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ClaimsDataPage;
