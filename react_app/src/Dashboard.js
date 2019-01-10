import React from "react";
import { Container,Col, Card, CardBody, Row } from "mdbreact";
import { BrowserRouter as Router } from "react-router-dom";
import { Bar } from 'react-chartjs-2';

class Dashboard extends React.Component {
 
     _eventSource= EventSource;
     _open= Boolean;
     API_URL = 'http://localhost:5000/reviews/stream/';

  constructor(props) {
    super(props);
    this.state = {
      collapseID: "",
      sources: {},
      source_reviews: {},
      dataBar: {},
      barChartOptions: {}
    };
    this.init();
  } 
  init() {
    this._eventSource = new EventSource(this.API_URL);
    this._eventSource.onmessage = (evt) => this._onMessage(evt);
    this._eventSource.onerror   = (evt) => this._onError(evt);
    this._eventSource.onopen = (evt) => this._onOpen(evt);
  }

  render() {

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
  async setBarData() {
    this.setState({ 
      loading: false,
      dataBar:{
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
    });
    this.setState({
      loading: false,
      barChartOptions: {
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
    })
  }
  
  _onMessage(message) {
    this._handleEvent(JSON.parse(message.data));
  }

  _onError(evt) {
    console.log("Error:");
    console.log(evt);
  }

  _onOpen(evt) {
    console.log("Open:");
    console.log(evt);
  }

  _handleEvent(event) {
   
    if (event) {
      this.source_reviews = event;
      this.setState({loading: false,source_reviews: event})
      if (this.state.source_reviews.sources) {
        this.setBarData();
      }
      
   }
  }
}

export default Dashboard;