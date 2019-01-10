#  Kafka Message Streams for Site and Product Reviews
Code: reactjs + expressjs  with a simple dashboard. Running Site and Product Reviews aggregation using Apache Kafka Streams

## Project Details
Four applications in this repository:

react_app: React.JS application that show a simple visualization of how many reviews we have for each type, and the different percentage of
Reviews coming from the different sources

kafkamessagestreams(root folder): Express.JS application (with kafka-node) that produces a periodic reviews data and consumes new messages from the api. 
* MongoDb port: 27017
* Database: "kb-new-review-topic"
* Collection: "reviews"

* Kafka topic : "kb-new-review-topic"
* Kafka port: 2181

## To run these applications, go through the following steps:
Download or Clone the project 
```
cd kafkamessagestreams &&
npm install
cd kafkamessagestreams\react_app &&
npm install
```
### Compiles and hot-reloads for development, runs the react and express.js apps concurrently
```
npm run dev
```
### Run your tests
```
npm run test
```
![](images/001.JPG?raw=true)
