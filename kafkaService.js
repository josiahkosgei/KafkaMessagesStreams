/*
This program connects to MongoDB (using the mongodb module )
This program consumes Kafka messages from topic kb-new-review-topic to which the reviews are productd.
 
This program records each latest update of the reviews in MongoDB. If a Review does not yet exist for a review it is inserted.
 
The program ensures that the MongoDB /kb-new-review-topic/reviews collection contains the reviews at any point in time.
 
*/
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// connect string for mongodb server running locally, connecting to a database called kb-new-review-topic
var url = 'mongodb://127.0.0.1:27017/';

var kafka = require('kafka-node')
var Consumer = kafka.Consumer
var client = new kafka.Client("localhost:2181/")
var reviewsTopic = "kb-new-review-topic";

var mongodb;

MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
    assert.equal(null, err);
    const kbDb = db.db('kb-new-review-topic')
    mongodb=kbDb;
    console.log("Connected correctly to MongoDB server.");
});
var captureReview = function(doc){
    // insertReview(mongodb, doc, function () {});  
    handleNewReviewMessage(doc)
}
var getReviews = function(business_id, callback){ 
   findReviews(mongodb, business_id,function (results) {
    callback(results);
   });
}
var insertReview = function (db, doc, callback) {
    // first try to update; if a review could be updated, we're done 
    updateReview(db, doc, function (results) {
        if (!results || results.result.n == 0) {
            // the review was not updated so presumably it does not exist; let's insert it  
            db.collection('reviews').insertOne(
                doc,
                function (err, result) {
                    assert.equal(err, null);
                    console.log("Inserted rev for " + doc.business_id);
                    callback();
                }
            );
        } //if
        else {
            console.log("Updated review for " + doc.business_id);
            callback();
        }
    }); //updateReview
}; //insertReview

// update Review if it exists
var updateReview = function (db, review, callback) {
    db.collection('reviews').updateOne({
        "business_id": review.business_id,
        "sources": review.sources,
        "Rating": review.Rating,
        "msg": review.msg,
        "type": review.type,
    }, {
        $set: {
            "msg": review.msg,
            "type": review.type,
            "sources": review.sources,
            "Rating": review.Rating
        }
    }, function (err, results) {
        callback(results);
    });
};
// returns all the reviews that match the query
const findReviews = function (db,business_id, callback) {
    // Get the reviews collection
    const collection = db.collection('reviews');
    var options =[
        {
          '$match': {
            'business_id': business_id
          }
        }, {
          '$group': {
            '_id': {
              'sources': '$sources', 
              'type': '$type'
            }, 
            'sourceCount': {
              '$sum': 1
            }
          }
        }, {
          '$group': {
            '_id': {
              'sources': '$_id.sources'
            }, 
            'reviews': {
              '$push': {
                'source': '$_id.sources', 
                'type': '$_id.type', 
                'total': '$sourceCount'
              }
            }
          }
        }
      ]
        
          // Get documents that match the query
          collection.aggregate(options).toArray(function(err, docs) {
                        assert.equal(null, err);
                        assert.equal(err, null);
                        callback(docs);
                     });
}
// Configure Kafka Consumer for Kafka "kb-new-review-topic" Topic and handle Kafka message
var consumer = new Consumer(
    client,
    [],
    {fromOffset: true}
);

consumer.on('message', function (message) {
    handleNewReviewMessage(message);
});

consumer.addTopics([{
    topic: reviewsTopic,
    partition: 0,
    offset: 0
}], () => console.log("topic " + reviewsTopic + " added to kafka consumer for listening"));

function handleNewReviewMessage(review) {
     insertReview(mongodb, review, function () {});

} // handleNewReviewMessage

module.exports = {handleNewReviewMessage,captureReview,getReviews };