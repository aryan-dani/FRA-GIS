import React, { useState, useMemo } from "react";
import {
  Table,
  Form,
  Row,
  Col,
  InputGroup,
  Spinner,
  Dropdown,
  Badge,
} from "react-bootstrap";
import { Search, Eye } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const getStatusBadge = (status) => {
  switch (status) {
    case "Approved":
      return "success";
    case "Rejected":
      return "danger";
    case "Pending":
    default:
      return "warning";
  }
};

function ClaimsTable({ claims, loading, onStatusChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    claim_type: "",
    status: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredClaims = useMemo(() => {
    return claims
      .filter((claim) => {
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
        return (
          (!filters.state || claim.state === filters.state) &&
          (!filters.district || claim.district === filters.district) &&
          (!filters.claim_type || claim.claim_type === filters.claim_type) &&
          (!filters.status || claim.status === filters.status)
        );
      });
  }, [claims, searchTerm, filters]);

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
  const uniqueStatuses = useMemo(
    () => [...new Set(claims.map((c) => c.status).filter(Boolean))],
    [claims]
  );

  return (
    <div>
      <Row className="filter-bar mb-3">
        <Col lg={3} md={6} className="mb-2">
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Live search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col lg={2} md={6} className="mb-2">
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
        <Col lg={2} md={4} className="mb-2">
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
        <Col lg={2} md={4} className="mb-2">
          <Form.Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">By Status</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
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
              <th>Claim Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">
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
                  <td>{claim.claim_type || "N/A"}</td>
                  <td>
                    <Dropdown
                      onSelect={(newStatus) =>
                        onStatusChange(claim.id, newStatus)
                      }
                    >
                      <Dropdown.Toggle
                        variant={getStatusBadge(claim.status)}
                        id={`dropdown-status-${claim.id}`}
                        size="sm"
                      >
                        {claim.status || "N/A"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item eventKey="Approved">
                          Approved
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="Rejected">
                          Rejected
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="Pending">
                          Pending
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>
                    <Link
                      to={`/claim/${claim.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <Eye className="me-1" /> View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
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
