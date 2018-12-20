const assert = require('assert');
const ReviewModel = require('../models/review.model');
describe('Deleting a review', () => {

  let review;

  beforeEach((done) => {
    review = new ReviewModel({ msg: 'review' });
    review.save()
      .then(() => done());
  });
  
  function assertHelper(statement, done) {
    statement
     .then(() => ReviewModel.find({}))
     .then((review) => {
      assert(review.length === 1);
      assert(review[0].msg === 'Pickachu');
      done();
    });
  }
  
  it('sets and saves review using an instance', (done) => {
    review.set('msg', 'Pickachu'); //not updated in mongodb yet
    assertHelper(review.save(), done);
   });
 
  it('update review using instance', (done) => {
    //useful to update multiple fields of the object
    assertHelper(review.update({ msg: 'Pickachu' }), done);
  });

  it('update all matching review using model', (done) => {
    assertHelper(ReviewModel.update({ msg: 'review' }, { msg: 'Pickachu' }), done);
  });

  it('update one review using model', (done) => {
    assertHelper(ReviewModel.findOneAndUpdate({ msg: 'review' }, { msg: 'Pickachu' }), done);
  });

  it('update one review with id using model', (done) => {
    assertHelper(ReviewModel.findByIdAndUpdate(review._id, { msg: 'Pickachu' }), done);
  });
});