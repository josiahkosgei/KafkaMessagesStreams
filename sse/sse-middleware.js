/*
Server-Sent Events is a technology for enabling unidirectional messaging over HTTP
*/
sse_middleware = function (req, res, next) {
    res.sseSetup = function() {
      req.socket.setTimeout(0);
      req.socket.setNoDelay(true);
      req.socket.setKeepAlive(true);
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.statusCode = 200;   
    }

    res.sseSend = function(data) {
      res.write("data: " + JSON.stringify(data) + "\n\n");
    }

    res.sseOnClose = function(callback) {
      req.on("onClose", callback);
    }

    next()
}
module.exports = sse_middleware;
