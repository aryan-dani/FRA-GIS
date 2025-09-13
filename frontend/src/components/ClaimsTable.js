import React, { useState, useMemo } from "react";
import { Table, Form, Row, Col, InputGroup, Spinner } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

function ClaimsTable({ claims, loading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    claim_type: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredClaims = useMemo(() => {
    return claims
      .filter((claim) => {
        // Text search
        const searchLower = searchTerm.toLowerCase();
        return (
          !searchTerm ||
          claim.name?.toLowerCase().includes(searchLower) ||
          claim.village?.toLowerCase().includes(searchLower) ||
          claim.district?.toLowerCase().includes(searchLower) ||
          claim.state?.toLowerCase().includes(searchLower)
        );
      })
      .filter((claim) => {
        // Filter dropdowns
        return (
          (!filters.state || claim.state === filters.state) &&
          (!filters.district || claim.district === filters.district) &&
          (!filters.claim_type || claim.claim_type === filters.claim_type)
        );
      });
  }, [claims, searchTerm, filters]);

  // Get unique values for filter dropdowns
  const uniqueStates = useMemo(
    () => [...new Set(claims.map((c) => c.state).filter(Boolean))],
    [claims]
  );
  const uniqueDistricts = useMemo(
    () => [...new Set(claims.map((c) => c.district).filter(Boolean))],
    [claims]
  );
  const uniqueClaimTypes = useMemo(
    () => [...new Set(claims.map((c) => c.claim_type).filter(Boolean))],
    [claims]
  );

  return (
    <div>
      <Row className="filter-bar">
        <Col lg={4} className="mb-2">
          <InputGroup className="live-search-bar">
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Live search by name, village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col lg={3} md={4} className="mb-2">
          <Form.Select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
          >
            <option value="">Filter by State</option>
            {uniqueStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={3} md={4} className="mb-2">
          <Form.Select
            name="district"
            value={filters.district}
            onChange={handleFilterChange}
          >
            <option value="">Filter by District</option>
            {uniqueDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={2} md={4} className="mb-2">
          <Form.Select
            name="claim_type"
            value={filters.claim_type}
            onChange={handleFilterChange}
          >
            <option value="">By Type</option>
            {uniqueClaimTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <div className="claims-table-container">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Village</th>
              <th>District</th>
              <th>State</th>
              <th>Claim Type</th>
              <th>Status</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  <Spinner animation="border" size="sm" /> Updating...
                </td>
              </tr>
            ) : filteredClaims.length > 0 ? (
              filteredClaims.map((claim, index) => (
                <tr key={claim.id}>
                  <td>{index + 1}</td>
                  <td>{claim.name || "N/A"}</td>
                  <td>{claim.village || "N/A"}</td>
                  <td>{claim.district || "N/A"}</td>
                  <td>{claim.state || "N/A"}</td>
                  <td>{claim.claim_type || "N/A"}</td>
                  <td>{claim.status || "N/A"}</td>
                  <td>{claim.latitude}</td>
                  <td>{claim.longitude}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No claims found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ClaimsTable;
