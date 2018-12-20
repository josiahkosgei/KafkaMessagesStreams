var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Defining schema for our Review API
var ReviewSchema = Schema({
  business_id:{type: String, required: true},
  msg:{type: String},
  type:{type: String, required: true},
  sources:{type: String, required: true},
  rating:{type: Number, required: true},
});
//Exporting our model
var ReviewModel = mongoose.model('Review', ReviewSchema);

module.exports = ReviewModel;