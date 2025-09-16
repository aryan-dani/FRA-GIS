import React from "react";
import { Row, Col } from "react-bootstrap";
import { BarChart, CheckCircle, ClockHistory } from "react-bootstrap-icons";

function StatCard({ icon, value, label, color }) {
  return (
    <div className="stat-card card shadow-sm">
      <div className="card-body d-flex align-items-center">
        <div
          className="stat-icon me-3"
          style={{
            backgroundColor: `rgba(${color}, 0.1)`,
            color: `rgb(${color})`,
          }}
        >
          {icon}
        </div>
        <div>
          <h4 className="h2 mb-0 font-weight-bold">{value}</h4>
          <p className="text-muted mb-0">{label}</p>
        </div>
      </div>
    </div>
  );
}

function DashboardStats({ stats }) {
  return (
    <Row className="mb-4">
      <Col md={4} className="mb-3 mb-md-0">
        <StatCard
          icon={<BarChart size={24} />}
          value={stats.totalClaims}
          label="Total Claims"
          color="0, 123, 255"
        />
      </Col>
      <Col md={4} className="mb-3 mb-md-0">
        <StatCard
          icon={<ClockHistory size={24} />}
          value={stats.claimsInReview}
          label="Pending Review"
          color="255, 193, 7"
        />
      </Col>
      <Col md={4}>
        <StatCard
          icon={<CheckCircle size={24} />}
          value={stats.claimsApproved}
          label="Approved Claims"
          color="40, 167, 69"
        />
      </Col>
    </Row>
  );
}

export default DashboardStats;
