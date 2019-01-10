var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var kafka = require('kafka-node')
var Consumer = kafka.Consumer
var reviewsTopic = "kb-new-review-topic";
var cfg = require('./config.js');
let kafkaProducer = require('./KafkaProducerService');
var client = new kafka.Client(cfg.kafka.host)
var reviewsTopic = "kb-new-review-topic";

var mongodb;
MongoClient.connect(cfg.MONGO_URL,{ useNewUrlParser: true }, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to MongoDB server.");
    mongodb= db.db(cfg.dbName);
  });
  
// MongoClient.connect(cfg.connectionString,{ useNewUrlParser: true }).then(client => {
//   let coll = client.db(cfg.dbName).collection(cfg.collectionName);
//  mongodb= client.db(cfg.dbName);
//   console.log('Connected to Database');
//   // Remove everything instead of dropping, which could invalidate exisiting change streams
//   return new Promise((resolve, reject) => {
//       return coll.remove({}, function (err, res) {
//           if (err) reject(err)
//           else resolve (coll);
//       });
//   });
// }).then(coll => {

//   setInterval(printInsertions, 1000);

//   // Start producer
//   kafkaProducer(coll, function (err) {
//     console.log("kafka Producer");
//       if (err) {
//           console.log(err);
//       }
//   });

// }).catch(err => {
//   console.log(err);
// });

function initDb(url, data) {
    return MongoClient.connect(url)
      .then(db => {
        const requests = Object.keys(data).map(col => {
          const collection = db.collection(col)
          return collection.insert(data[col])
        })
        return Promise.all(requests)
      })
  }
  
  function dropDb(url) {
    return MongoClient.connect(url)
      .then(db => db.collections())
      .then(collections => {
        const requests = collections.map(col => col.drop())
        return Promise.all(requests)
      })
  }
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
    const collection = mongodb.collection(cfg.collectionName);
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

// // Configure Kafka Consumer for Kafka "kb-new-review-topic" Topic and handle Kafka message
var consumer = new Consumer(
    client,
    [],
    {fromOffset: true}
);

consumer.on('message', function (message) {
    handleNewReviewMessage(message);
});

consumer.addTopics([{
    topic: cfg.kafka.topic,
    partition: 0,
    offset: 0
}], () => console.log("topic //" + cfg.kafka.topic + "// added to kafka consumer for listening"));

function handleNewReviewMessage(review) {
     insertReview(mongodb, review, function () {});

} // handleNewReviewMessage

module.exports = {handleNewReviewMessage,captureReview,getReviews,initDb,dropDb };