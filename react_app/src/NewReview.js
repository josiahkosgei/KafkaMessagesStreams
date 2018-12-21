import React from "react";
import { MDBRow, MDBCol, MDBBtn, Container, MDBInput, } from "mdbreact";
import { BrowserRouter as Router } from "react-router-dom";


const API = 'http://localhost:3000';

class NewReview extends React.Component {
  
  constructor() {
    super();
    this.handleReviewSubmit = this.handleReviewSubmit.bind(this);
  }
  
  async  handleReviewSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    event.preventDefault()
    const review = {}
   for (let entry of data.entries()) {
    review[entry[0]] = entry[1]
   }
    
    try {
      review['business_id'] = "WAUXU64B23N095540";
   var formdata=   JSON.stringify(review)
       console.log('data',formdata);
      const response = await fetch(`${API}/reviews/data`, {
      method: 'POST',
      body: formdata,
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
  
  render() {
    return (
      <Router>
      <div>
        <Container>
        <form onSubmit={this.handleReviewSubmit}>
          <MDBRow>
            <MDBCol md="6" className="mb-3">
            <select className="browser-default custom-select" id="Source"  name="Source"  required>
                <option value="" defaultValue  disabled>Choose Source</option>
                <option value="Facebook">Facebook</option>
                <option value="Amazon">Amazon</option>
                <option value="Kudobuzz">Kudobuzz</option>
            </select>
            </MDBCol>
                      
            <MDBCol md="6" className="mb-3">
            <select className="browser-default custom-select" required  id="Type"  name="Type"  >
                <option value="" defaultValue disabled>Choose Type</option>
                <option value="Product">Product</option>
                <option value="Site">Site</option>
            </select>
        
            </MDBCol>
           </MDBRow>
          <MDBRow>
            <MDBCol md="6" className="mb-3">
            <select className="browser-default custom-select" required  id="Rating"  name="Rating"  >
                <option value="" defaultValue  disabled>Select Rating</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            </MDBCol>
            <MDBCol md="6" className="mb-3">
                <MDBInput type="textarea" label="Message" rows="2" required id="msg"  name="msg" />
            </MDBCol>
          </MDBRow>
          <MDBBtn color="primary" type="submit">
            Submit Reviews
          </MDBBtn>
        </form>
      
        </Container>
        </div>
      </Router>
    );
  }
}

export default NewReview;