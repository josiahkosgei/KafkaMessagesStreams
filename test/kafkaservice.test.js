const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const HOST = `http://localhost:${PORT}`;
const kafkaService = require('../kafkaService');
const Post = require('../models/review.model');

describe('Routing and Integration Tests', () => {
  describe('kafkaService', () => {
    before((done) => {
      mongoose.connection.db.drop(() => {
        console.log('Cleaning - test database dropped');
      });
      return done();
    });
    it('should reject invalid data with 400 status', (done) => {
      const badReq = {
        "business_id": "WAUXU64B23N095540",
        "msg": "nice shorts 2",
        "type": "Site",
        "sources": "Amazon",
        "Rating": "5"
      };
      request(HOST)
        .post('/reviews')
        .send(badReq)
        .expect(400, done);
    });
    it('should accept valid data and return 200 status with saved object', (done) => {
      const goodReq = {
        "business_id": "WAUXU64B23N095540",
        "msg": "nice shorts 3",
        "type": "Product",
        "sources": "Amazon",
        "Rating": 5
      };
      request(HOST)
        .post('/reviews')
        .send(goodReq)
        .expect((res) => {
          expect(res.body).to.include(goodReq);
        })
        .expect(200, done);
    });
    it('should respond to API request with all listings', (done) => {
      const anotherReq = {
        "business_id": "WAUXU64B23N095540",
        "msg": "nice shorts 4",
        "type": "Site",
        "sources": "Facebook",
        "Rating": 5
      };
      request(HOST)
        .post('/reviews')
        .send(anotherReq)
        .then(() => {
          request(HOST)
            .get('/api')
            .expect((res) => {
              expect(res.body.length).to.eq(2);
            })
            .expect(200, done);
        });
    });

    after(() => {
      mongoose.connection.close(() => {
        console.log('Test database connection closed');
      });
    });
  });
});