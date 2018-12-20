const assert = require('assert');
const ReviewModel = require('../models/review.model');
describe('Creating reviews', () => {
    it('creates a review ', (done) => {
        //assertion is not included in mocha so 
        //require assert which was installed along with mocha
        const poke = new ReviewModel({ msg: 'Pickachu' });
        poke.save() //takes some time and returns a promise
            .then(() => {
                assert(!poke.isNew); //if poke is saved to db it is not new
                done();
            });
    });
});