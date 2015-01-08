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

connection.connect();

var port = process.env.PORT || 4000;

app.listen(port, function() {
 console.log("Express server listening on " + port);
});


io.sockets.on('connection', function(client) {
  console.log('socket connected');
  
  client.on('approved', function(data) {
    console.log('approved', data);
    var voice_id = data.id;

    connection.query('SELECT `posts`.* FROM `posts` WHERE `posts`.`approved` = 1 AND (`posts`.voice_id = ' + voice_id + ') ORDER BY id DESC', function(err, rows, fields) {
      if (err) throw err;

      var firstPage   = 60;
      var perPage     = 60;
      var itemInPage  = 0;

      console.log('Results: ', rows.length);
      
      rows.forEach(function(row, i) {
        client.emit('posts-data', {  
          channel: 'stdout',
            value: row
        });

        if (i == firstPage) {
          client.emit('firstPageFinished');
        }

        if (itemInPage == perPage) {
          client.emit('nextPage');
          itemInPage = 0; 
        }

        if (i == rows.length - 1) {
          client.emit('finished');
        }

        itemInPage++;
      });
    });
  });

  client.on('unapproved', function(data) {
    console.log('unapproved', data);
    var voice_id = data.id;

    connection.query('SELECT `posts`.* FROM `posts` WHERE `posts`.`approved` = 0 AND (`posts`.voice_id = ' + voice_id + ') ORDER BY id DESC LIMIT 20000', function(err, rows, fields) {
      if (err) throw err;

      var firstPage   = 60;
      var perPage     = 60;
      var itemInPage  = 0;

      console.log('Results: ', rows.length);
      
      rows.forEach(function(row, i) {
        client.emit('posts-data', {  
          channel: 'stdout',
            value: row
        });

        if (i == firstPage) {
          client.emit('firstPageFinished');
        }

        if (itemInPage == perPage) {
          client.emit('nextPage');
          itemInPage = 0; 
        }

        if (i == rows.length - 1) {
          client.emit('finished');
        }
        
        itemInPage++;
      });
    });
  });
});


// connection.end();