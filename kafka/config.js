"use strict";

var Config = {
    listenPort: 3000,
    connectionString: "mongodb://127.0.0.1:27000/kb-new-review-topic?replicaSet=replset",
    collectionName: "reviews",
    dbName: "kb-new-review-topic",
    kafka: {
        topic: 'kb-new-review-topic',
        host: 'localhost:2181',
        groupPrefix: 'kafka-node-'
    },
    TOPIC: 'kb-new-review-topic',
    TOPIC_EVENTS: 'finalevents',
    KAFKA_HOST: '127.0.0.1:9092',
    PUBSUB_TOPIC: 'kb-new-review-topic',
    MONGO_URL: 'mongodb://localhost:27017/kb-new-review-topic',
    MONGO_COLLECTION: 'reviews',
    ENDPOINT_URL: 'http://127.0.0.1:3000/produce',
    API_PORT: 3000,
    API_CON_TIMEOUT: 5000, // ms
    PRODUCER_CONFIG: {
        requireAcks: 1,
        ackTimeoutMs: 100,
        partitionerType: 4
    }

}

module.exports = Config;