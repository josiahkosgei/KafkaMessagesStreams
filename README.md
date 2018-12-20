# Kudobuzz Reviews 
Kudobuzz Code: reactjs + expressjs  with a simple dashboard. Running Reviews aggregation using Apache Kafka Streams

## Project Details
Four applications in this repository:

kudobuzzchallenge_react: React.JS application that show a simple visualization of how many reviews we have for each type, and the different percentage of
Reviews coming from the different sources

kudobuzzchallenge(root folder): Express.JS application (with kafka-node) that produces a periodic reviews data and consumes new messages from the api. 
* MongoDb port: 27017
* Database: "kb-new-review-topic"
* Collection: "reviews"

* Kafka topic : "kb-new-review-topic"
* Kafka port: 2181
* node KafkaCountryProducer.js


## To run these applications, go through the following steps:
Download or Clone the project 
```
cd KudobuzzCodeChallenge &&
npm install
```
### Compiles and hot-reloads for development, runs the react and express.js apps concurrently
```
npm run dev
```
### Compiles and minifies for production
```
npm run build
```
### Run your tests
```
npm run test
```
### Lints and fixes files
```
npm run lint
```
### Run your unit tests
```
npm run test:unit
```

