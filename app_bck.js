const http         = require('http'),
      fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      env          = process.env;

/*
      var json;
      var request = require('request');
      var accessToken = "ab9ae3bb3f994e35a0f1b667f374665d";
      var text = "who are you";
      var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + accessToken
      }
      var options = {
        url: 'https://api.api.ai/v1/query?v=20150910',
        method: 'POST',
        json: true,
        headers: headers,
        data: JSON.stringify({ query: text, lang: "en", sessionId: "minthings" })
      }
      request(options, function (error, response, body) {
          //console.log("req option1");
          console.log('in request');
        if (!error && response.statusCode == 200) {
            console.log(body);
            //response.end('' + body);
            //json = JSON.parse(body);
            json = body;
            //res.write(json);
        }
      });
      */
var code = 405;
var apiai = require('apiai');
var app = apiai("ab9ae3bb3f994e35a0f1b667f374665d");

let server = http.createServer(function (req, res) {
  let url = req.url;
  if (url == '/') {
        var request = app.textRequest('who are you', {
            sessionId: 'minthings'
        });
        request.on('response', function(response) {
            //console.log(response);
            res.end(JSON.stringify(response));
        });
        request.on('error', function(error) {
            //console.log(error);
            res.end(error);
        });
        request.end();
    //url += 'index.html';
      //console.log(json);
      //res.end(JSON.stringify(json));
      //res.end('Hello Node !');
  } else {
        res.writeHead(code, {});
        res.end();
  }

  // IMPORTANT: Your application HAS to respond to GET /health with status 200
  //            for OpenShift health monitoring

  if (url == '/health') {
    res.writeHead(200);
    res.end();
  } else if (url == '/info/gen' || url == '/info/poll') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[url.slice(6)]()));
  } else {
    fs.readFile('./static' + url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
      } else {
        let ext = path.extname(url).slice(1);
        if (contentTypes[ext]) {
          res.setHeader('Content-Type', contentTypes[ext]);
        }
        if (ext === 'html') {
          res.setHeader('Cache-Control', 'no-cache, no-store');
        }
        res.end(data);
      }
    });
  }
});

server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
