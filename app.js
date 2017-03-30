'use strict';
const http         = require('http'),
      url          = require('url'),
      fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      env          = process.env;


var apiai = require("apiai");
var api = apiai("ab9ae3bb3f994e35a0f1b667f374665d");
var code = 405;

var express = require('express');
var app = express();
//var pub = path.join(__dirname, 'public');

// Define the port to run on
app.set('port', 3000);
//app.use(express.static(pub));

app.get('/ai', function (request, response) {
    //response.end(request.query.q);
    var text = request.query.q;
        var textRequest = api.textRequest(text, {
            sessionId: 'minthings'
        });

        textRequest.on('response', function(_response) {
            //console.log(JSON.stringify(_response));
            response.end(JSON.stringify(_response));
        });

        textRequest.on('error', function(error) {
            //console.log(error);
            response.end();
        });

        request.on('data', function(chunk) {
            textRequest.write(chunk);
            //console.log('hey');
        });

        request.on('end', function() {
            textRequest.end();
        });
    //console.log(pub);
    //console.log(path.join(__dirname, 'public'));
    //console.log(__relative);
    //console.log(__basename);
   //res.sendFile(pub + "/" + "index.htm" );
    //res.end('hi');
});

app.get('/health', function (request, response) {
    response.writeHead(200);
    response.end();
});
app.get(['/info/gen','/info/poll'], function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Cache-Control', 'no-cache, no-store');
    response.end(JSON.stringify(sysInfo[url.slice(6)]()));
});
app.get('/', function (request, response) {
    fs.readFile('./static' + request.url, function (err, data) {
      if (err) {
        response.writeHead(404);
        response.end('Not found');
      } else {
        let ext = path.extname(request.url).slice(1);
        if (contentTypes[ext]) {
          response.setHeader('Content-Type', contentTypes[ext]);
        }
        if (ext === 'html') {
          response.setHeader('Cache-Control', 'no-cache, no-store');
        }
        response.end(data);
      }
    });
});

//server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
//  console.log(`Application worker ${process.pid} started...`);
//});


var server = app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function() {
  //var port = server.address().port;
  //console.log('Magic happens on port ' + port);
  console.log(`Application worker ${process.pid} started...`);
});

/*
var server = http.createServer(function(request, response) {
    //var parsedUrl = url.parse(request.url, true);
    //var queryAsObject = parsedUrl.query;
    var text = 'hi';
    //console.log(queryAsObject['q']);
    //response.end(queryAsObject['q']);
    
    if (request.method == 'GET' && request.url == '/ai?') {
        var textRequest = app.textRequest(text, {
            sessionId: 'minthings'
        });

        textRequest.on('response', function(_response) {
            //console.log(JSON.stringify(_response));
            response.end(JSON.stringify(_response));
        });

        textRequest.on('error', function(error) {
            //console.log(error);
            response.end();
        });

        request.on('data', function(chunk) {
            textRequest.write(chunk);
            //console.log('hey');
        });

        request.on('end', function() {
            textRequest.end();
        });
    }

    //console.log(request.headers);

// cat ann_smith.wav | curl -v -X POST --data-binary @- -H "Transfer-Encoding: chunked" -H "Content-Type: audio/wav" http://localhost:8000/upload

  else if (request.url == '/health') {
    response.writeHead(200);
    response.end();
  } else if (request.url == '/info/gen' || request.url == '/info/poll') {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Cache-Control', 'no-cache, no-store');
    response.end(JSON.stringify(sysInfo[url.slice(6)]()));
  } else {
    fs.readFile('./static' + request.url, function (err, data) {
      if (err) {
        response.writeHead(404);
        response.end('Not found');
      } else {
        let ext = path.extname(request.url).slice(1);
        if (contentTypes[ext]) {
          response.setHeader('Content-Type', contentTypes[ext]);
        }
        if (ext === 'html') {
          response.setHeader('Cache-Control', 'no-cache, no-store');
        }
        response.end(data);
      }
    });
  }
});

server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
*/