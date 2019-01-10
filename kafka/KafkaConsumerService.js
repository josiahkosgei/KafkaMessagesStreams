
var kafka = require('kafka-node');
var config = require('./config');
var io = require('socket.io')(http);

var consumer = new kafka.ConsumerGroup({
    kafkaHost: config.kafka.host,
    fromOffset: 'latest',
    groupId: config.kafka.groupPrefix + port
   },
  [ config.kafka.topic ]
);
// Stream data on this namespace to any client that connects
var reviewsNs = io.of('/marketData');
reviewsNs.on('connection', function(socket) {
    console.log("Accepted socket.io client");
    socket.on('disconnect', function(socket) {
      console.log("Client disconnected");
    });
});
// Start the Kafka consumer to broadcast data to connecting clients
var lastEmits = {};
// Keep a map 
consumer.on('message', function(message) {
    var value = JSON.parse(message.value);
    value.date = message.key;
    var now = new Date().getTime();
    var lastEmit = lastEmits[value.symbol] || 0;
    if (now - lastEmit  >= 1000) {
        reviewsNs.emit('price', value);
        lastEmits[value.symbol] = now;
    }
});
consumer.on('error', function(message) {
  console.log("Kafka consumer error: " + message);
});
