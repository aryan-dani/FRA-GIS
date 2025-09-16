import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import "./Analytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale
);

function StatCard({ title, value, icon, color }) {
  return (
    <div className="stat-card-analytics">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  );
}

function Analytics({ claims }) {
  // --- Data Processing ---
  const claimsByType = claims.reduce((acc, claim) => {
    const type = claim.claim_type || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const claimsByStatus = claims.reduce((acc, claim) => {
    const status = claim.status || "Pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const claimsByDistrict = claims.reduce((acc, claim) => {
    const district = claim.district || "Unknown";
    acc[district] = (acc[district] || 0) + 1;
    return acc;
  }, {});

  const claimsOverTime = claims.reduce((acc, claim) => {
    if (claim.created_at) {
      const date = new Date(claim.created_at).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedDates = Object.keys(claimsOverTime).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const cumulativeClaims = sortedDates.reduce((acc, date) => {
    const count = claimsOverTime[date];
    const lastTotal = acc.length > 0 ? acc[acc.length - 1].y : 0;
    acc.push({ x: date, y: lastTotal + count });
    return acc;
  }, []);

  const totalClaims = claims.length;
  const approvedClaims = claimsByStatus["Approved"] || 0;
  const approvalRate =
    totalClaims > 0 ? ((approvedClaims / totalClaims) * 100).toFixed(1) : 0;

  // --- Chart Data and Options ---
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const timeSeriesOptions = {
    ...chartOptions,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "MMM dd, yyyy",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Cumulative Number of Claims",
        },
      },
    },
  };

  const doughnutData = {
    labels: Object.keys(claimsByStatus),
    datasets: [
      {
        data: Object.values(claimsByStatus),
        backgroundColor: ["#2e7d32", "#c62828", "#ff8f00"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: Object.keys(claimsByDistrict),
    datasets: [
      {
        label: "Number of Claims",
        data: Object.values(claimsByDistrict),
        backgroundColor: "rgba(0, 77, 64, 0.7)",
        borderColor: "rgba(0, 77, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    datasets: [
      {
        label: "Total Claims Over Time",
        data: cumulativeClaims,
        fill: true,
        backgroundColor: "rgba(46, 125, 50, 0.2)",
        borderColor: "#2e7d32",
        tension: 0.3,
      },
    ],
  };

  return (
    <div>
      <Row className="mb-4">
        <Col md={4}>
          <StatCard
            title="Total Claims"
            value={totalClaims}
            color="rgba(46, 125, 50, 0.2)"
          />
        </Col>
        <Col md={4}>
          <StatCard
            title="Approved Claims"
            value={approvedClaims}
            color="rgba(0, 105, 92, 0.2)"
          />
        </Col>
        <Col md={4}>
          <StatCard
            title="Approval Rate"
            value={`${approvalRate}%`}
            color="rgba(255, 143, 0, 0.2)"
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header>Claims Over Time</Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: "300px" }}>
                <Line data={lineData} options={timeSeriesOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header>Claims by Status</Card.Header>
            <Card.Body>
              <div className="chart-container">
                <Doughnut data={doughnutData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header>Claims by District</Card.Header>
            <Card.Body>
              <div className="chart-container">
                <Bar data={barData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header>Claims by Type</Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: "400px" }}>
                <Bar
                  data={{
                    labels: Object.keys(claimsByType),
                    datasets: [
                      {
                        label: "Number of Claims",
                        data: Object.values(claimsByType),
                        backgroundColor: "rgba(0, 105, 92, 0.7)",
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Analytics;
