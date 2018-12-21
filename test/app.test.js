'use strict';

const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../app.js'); // Our app

describe('API endpoint /reviews', function() {
  this.timeout(5000); // How long to wait for a response (ms)

  before(function() {

  });

  after(function() {

  });

  // GET - List all reviews
  it('should return all reviews', function() {
    return chai.request(app)
      .get('/reviews')
      .send({"business_id": "WAUXU64B23N095540"})
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
      });
  });

  // POST - Add new review
  it('should add new review', function() {
    return chai.request(app)
      .post('/reviews/data')
      .send({
        "business_id": "WAUXU64B23N095540",
        "msg": "nice shorts",
        "type": "Site",
        "sources": "Amazon",
        "Rating": 5
        })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
      });
  });

  // POST - Accept the Request
  it('should accept the Request', function() {
    return chai.request(app)
      .post('/reviews/data')
      .type('form')
      .send({
        "business_id": "WAUXU64B23N095540",
        "msg": "nice shorts",
        "type": "Site",
        "sources": "Amazon",
        "Rating": 5
        })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
      })
  });
});