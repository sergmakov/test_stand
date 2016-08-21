var http = require('http');
var analyze = require('../analyze.js');

http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  waitUntilBodyReaded(req, function(data) {
    console.log(data);
    analyze.main('syntax', data.text, function(err, result){
      res.end(JSON.stringify(err ? err : result));
    });
  })
}).listen('3333', 'localhost', function() {});

function waitUntilBodyReaded(req, cb){
  var data = '';

  req.on('data', function(chunk) {

    data += chunk.toString();
  });

  req.on('end', function() {
    if(!data) data = 'false';
    console.log(data);
    cb(JSON.parse(data));
  });
}
