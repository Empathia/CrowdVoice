var fs = require('fs');
var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var app = express()
, server = http.createServer(app)
 , io = socketio.listen(server);             // socket needs to listen on http server
 
server.listen(9099);

var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'deploy',
  password : 'i3gh7rb1wer',
  database : 'crowdvoice_production'
});

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'crowdvoice_production'
// });

connection.connect();

var port = process.env.PORT || 4000;

app.listen(port, function() {
 console.log("Express server listening on " + port);
});


var split = function split(a, n) {
    var len = a.length,out = [], i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / n--);
        out.push(a.slice(i, i + size));
        i += size;
    }
    return out;
}

io.sockets.on('connection', function(client) {
  console.log('socket connected');
  
  client.on('approved', function(data) {
    console.log('approved', data);
    var voice_id = parseInt(data.id, 10);

    connection.query('SELECT `posts`.* FROM `posts` WHERE `posts`.`approved` = 1 AND (`posts`.voice_id = ' + voice_id + ') ORDER BY id DESC', function(err, rows, fields) {
      if (err) throw err;


      console.log('Results: ', rows.length);

      var pagesCount = Math.round(rows.length / (rows.length / 30) );

      var pages = split(rows, pagesCount);

      pages.forEach(function(page, i) {
        
        if (i === 0) {
          client.emit('page', {  
            firstPageRows: page,
            first : true
          });
          client.emit('firstPageFinished');
          
        } else {
          client.emit('page', {  
            firstPageRows: page,
            first : false
          });
          client.emit('nextPage');
        }

        if (i == pages.length - 1) {
          client.emit('finished');
        }
      });
    });
  });

  client.on('unapproved', function(data) {
    console.log('unapproved', data);
    var voice_id = parseInt(data.id, 10);

    connection.query('SELECT `posts`.* FROM `posts` WHERE `posts`.`approved` = 0 AND (`posts`.voice_id = ' + voice_id + ') ORDER BY id DESC LIMIT 20000', function(err, rows, fields) {
      if (err) throw err;

      console.log('Results: ', rows.length);

      var pagesCount = Math.round(rows.length / (rows.length / 30) );

      var pages = split(rows, pagesCount);

      pages.forEach(function(page, i) {
        
        if (i === 0) {
          client.emit('page', {  
            firstPageRows: page,
            first : true
          });
          client.emit('firstPageFinished');
          
        } else {
          client.emit('page', {  
            firstPageRows: page,
            first : false
          });
          client.emit('nextPage');
        }

        if (i == pages.length - 1) {
          client.emit('finished');
        }
      });
    });
  });
});


// connection.end();