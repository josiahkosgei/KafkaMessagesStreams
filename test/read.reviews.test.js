const assert = require('assert');
const ReviewModel = require('../models/review.model');
let review;
beforeEach(() => {
    review = new ReviewModel({  name: 'review' });
    review.save()
        .then(() => done());
});
describe('Reading reviews', () => {
    it('finds reviews', (done) => {
        ReviewModel.findOne({ name: 'review' })
            .then((reviews) => {
                assert(review.name === 'review'); 
                done();
            });
    })
})