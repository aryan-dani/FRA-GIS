import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Analytics({ claims }) {
  // --- Data Processing for Charts ---
  const claimsByType = claims.reduce((acc, claim) => {
    const type = claim.claim_type || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const claimsByStatus = claims.reduce((acc, claim) => {
    const status = claim.status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // --- Chart Data and Options ---
  const pieChartData = {
    labels: Object.keys(claimsByType),
    datasets: [
      {
        label: "Claims by Type",
        data: Object.values(claimsByType),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(claimsByStatus),
    datasets: [
      {
        label: "Claims by Status",
        data: Object.values(claimsByStatus),
        backgroundColor: ["#1abc9c", "#e74c3c", "#f1c40f"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <Card className="analytics-card">
      <Card.Header as="h3">Claims Analytics</Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <h4 className="chart-title">Claims by Type</h4>
            {claims.length > 0 ? (
              <Pie
                data={pieChartData}
                options={{
                  ...chartOptions,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Claims by Type",
                  },
                }}
              />
            ) : (
              <p className="text-center">No data to display.</p>
            )}
          </Col>
          <Col md={6}>
            <h4 className="chart-title">Claims by Status</h4>
            {claims.length > 0 ? (
              <Bar
                data={barChartData}
                options={{
                  ...chartOptions,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Claims by Status",
                  },
                }}
              />
            ) : (
              <p className="text-center">No data to display.</p>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default Analytics;
