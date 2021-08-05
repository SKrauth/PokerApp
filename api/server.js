var express = require('express'),
  app = express(),
  port = process.env.PORT || 3001;

var routes = require('./routes/pokerRoutes');
routes(app);

app.listen(port);
