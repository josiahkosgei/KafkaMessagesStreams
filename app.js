var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');

var indexRouter = require('./routes/index');
var reviewsRouter = require('./routes/reviews');
var kafkaService = require('./kafka/kafkaService')
var sse_middleware = require('./sse/sse-middleware');

var app = express();

const port = process.env.PORT || 5000;
var channels = [];
var interval;

app.use(sse_middleware);
app.use(cors());
app.options('*', cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({  extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/reviews', reviewsRouter);

app.get('/reviews/stream', function(req, res) {
  console.log("New subscriber request");
  res.sseSetup();
  channels.push(res);
  res.sseOnClose(()=> {
  })
})

// capture reviews from clients
app.post('/reviews/data/', (request, response) => {
  const postBody = request.body;
  kafkaService.captureReview(postBody)
  response.send(postBody);
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function createMockEvent(callback) {
  sources=[];
  totalreviews=[];
 kafkaService.getReviews('WAUXU64B23N095540', function (results) {
    for (let i = 0; i < results.length; i++) {
      sources.push(results[i]._id.sources)
     
      let productval = 0;
      let siteval = 0;
      if (results[i].reviews.length === 2) {
        productval = results[i].reviews.find(x => x.type === 'Product').total;
        siteval = results[i].reviews.find(x => x.type === 'Site').total;
        totalreviews.push({
          productval,
          siteval
        })
      } else {
        for (let j = 0; j < results[i].reviews.length; j++) {
          productval = results[i].reviews[j].type === "Product" ? results[i].reviews[j].total : 0;
          siteval = results[i].reviews[j].type === "Site" ? results[i].reviews[j].total : 0;
          totalreviews.push({
            productval,
            siteval
          })
        }

      }
    }
    callback({sources,totalreviews});  
  });
}

function start() {
  let data={}; 
  interval = setInterval(() => {
    createMockEvent(function (results){
      data=results
    }); // to implement yourself
   
    for(let key in channels) {
      if(channels.hasOwnProperty(key)) {
        channels[key].sseSend(data);
      }
    }
  }, 2000);
};
app.listen(port, function() {
  console.log(`Listening on port ${port}...`);
  start();
})
module.exports = app; 