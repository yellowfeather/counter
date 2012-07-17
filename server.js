(function() {
  var express = require('express'), http = require('http');

  var app = express();

  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {
        layout: false
    });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({
      src: __dirname + '/public'
    }));
    app.use(app.router);
    return app.use(express.static(__dirname + '/public'));
  });
  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure('production', function() {
    return app.use(express.errorHandler());
  });

  var server = http.createServer(app);
  var io = require('socket.io').listen(server);

  count = 0;
  io.sockets.on('connection', function(socket) {
    count++;
    io.sockets.emit('count', {
      number: count
    });
    return socket.on('disconnect', function() {
      count--;
      return io.sockets.emit('count', {
        number: count
      });
    });
  });
  app.get('/', function(req, res) {
    return res.render('index', {
      title: 'node.js express socket.io counter'
    });
  });

  if (!module.parent) {
    port = 10927;
    server.listen(port);
    console.log("Express server listening on port %d", port);
  }
}).call(this);
