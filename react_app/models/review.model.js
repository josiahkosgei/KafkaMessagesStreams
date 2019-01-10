var reviewModel = {
  business_id:{type: String, required: true},
  msg:{type: String},
  type:{type: String, required: true},
  sources:{type: String, required: true},
  rating:{type: Number, required: true},
};
module.exports = reviewModel;