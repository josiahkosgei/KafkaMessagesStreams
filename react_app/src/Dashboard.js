import React from "react";
import { Container,Col, Card, CardBody, Row } from "mdbreact";
import { BrowserRouter as Router } from "react-router-dom";
import { Bar } from 'react-chartjs-2';

const API = 'http://localhost:3000';
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseID: "",
      sources: [],
      source_reviews: [],
      dataBar: {},
      barChartOptions: {}
    };
  }
  
  render() {
    let that=this;
    this.getReviews().then(function() {
      that.setBarData();
    });

    let canvas_styles = {
      display: 'block',
      width: '590px',
      height: '843px',
    };
    return (
        <Router>
    <Container>
        <Row className="mb-4">
              <Col md="8"className="mb-4">
                  <Card className="mb-4">
                      <CardBody>
                      <Bar data={this.state.dataBar} id={"canv_id"} style={canvas_styles} options={this.state.barChartOptions}/>
                      </CardBody>
                  </Card>
              </Col>
              </Row>
              </Container>
              </Router>
    );
  }
  async fetch(method, endpoint, body) {
    try {
      const response = await fetch(`${API}${endpoint}`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json'
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
  async getReviews() {
    this.setState({ loading: false, source_reviews: await this.fetch('get', '/reviews/?business_id=WAUXU64B23N095540') });
  }
  async setBarData() {
    this.state.dataBar= {
        labels: ['Site Reviews', 'Product Reviews'],
        datasets: [
        {
            label: this.state.source_reviews.sources[0],
            data: [this.state.source_reviews.totalreviews[0].siteval, this.state.source_reviews.totalreviews[0].productval],
            backgroundColor: 'rgba(90, 173, 246, 0.5)',
            borderWidth: 1
        }, 
        {
            label: this.state.source_reviews.sources[1],
            data: [this.state.source_reviews.totalreviews[1].siteval, this.state.source_reviews.totalreviews[1].productval],
            backgroundColor: 'rgba(245, 74, 85, 0.5)',
            borderWidth: 1
        }, {
            label: this.state.source_reviews.sources[2],
            data: [this.state.source_reviews.totalreviews[2].siteval, this.state.source_reviews.totalreviews[2].productval],
            backgroundColor: 'rgba(245, 192, 50, 0.5)',
            borderWidth: 1
        }
        ]
    }
    this.state.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
      xAxes: [{
          barPercentage: 1,
          gridLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
          }
      }],
      yAxes: [{
          gridLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
          beginAtZero: true
          }
      }]
      }
  }
  }
}

export default Dashboard;