var express = require('express');
var app = express();
var port = 3000;

app.use(express.static('www'));

app.listen(port, function(err){
  console.log('Web app listening on port %s !', port);
});