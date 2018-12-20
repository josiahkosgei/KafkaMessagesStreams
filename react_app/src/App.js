import React from "react";
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Container,Col, Card, CardBody, Row,  } from "mdbreact";
import { BrowserRouter as Router } from "react-router-dom";

import { Bar } from 'react-chartjs-2';

const API = 'http://localhost:3000';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseID: "",
      sources: [],
      source_reviews: [],
      dataBar: [],
      barChartOptions: []
    };
  }
  state = {
    isOpen: false
  };

  toggleCollapse = collapseID => () =>
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));

  closeCollapse = collapseID => () =>
    this.state.collapseID === collapseID && this.setState({ collapseID: "" });

    componentDidMount() {
      // let that=this;
      // this.getReviews().then(function(value) {
      //   that.setBarData();
      // });
    //   let that=this;
    // this.getReviews().then(function(value) {
    //   that.setBarData();
    // });
    }
  render() {
    let that=this;
    this.getReviews().then(function() {
      that.setBarData();
    });

    const overlay = (
      <div
        id="sidenav-overlay"
        style={{ backgroundColor: "transparent" }}
        onClick={this.toggleCollapse("mainNavbarCollapse")}
      />
    );
    let canvas_styles = {
      display: 'block',
      width: '590px',
      height: '843px',
    };
    return (
  <Router>
        <div className="flyout">
      <Navbar color="indigo" dark expand="md">
          <NavbarBrand>
            <strong className="white-text">Kudobuzz Challenge</strong>
          </NavbarBrand>
          <NavbarToggler
            onClick={this.toggleCollapse}
          />
          <Collapse
            id="navbarCollapse3"
            isOpen={this.state.isOpen}
            navbar
          >
          </Collapse>
      </Navbar>
      {this.state.collapseID && overlay}
          <main style={{ marginTop: "4rem" }}>
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
          {/* <Container> */}
          {/* <div class="row">
          <div class="col-md-8 mx-auto">
          <Bar data={this.state.dataBar} height={500} options={this.state.barChartOptions} />
          </div>
          </div> */}
        {/* </Container> */}
          </main>
          </div>
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

export default App;