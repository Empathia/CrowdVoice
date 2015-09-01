var fs = require('fs');
var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var app = express()
, server = http.createServer(app)
 , io = socketio.listen(server);             // socket needs to listen on http server

server.listen(9099);

var connection;

if (process.env.NODE_ENV === 'production') {
  connection = {
    host     : '127.0.0.1',
    user     : 'deploy',
    password : 'i3gh7rb1wer',
    database : 'crowdvoice_production'
  }
} else {
  connection = {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'crowdvoice_production'
  }
}

var knex = require('knex')({
  client: 'mysql',
  connection: connection
});

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

    knex('posts').where({'approved': true, 'voice_id' : voice_id}).count('*').asCallback(function(err, total) {
      var pages = Math.round(total[0]["count(*)"] / 120);



      knex('posts').where({'approved': true, 'voice_id' : voice_id}).orderBy('id', 'desc').limit(120).asCallback(function(err, posts){
        client.emit('firstPage', {
          posts : posts,
          page : 1,
          pages : pages
        });
      });
    });
  });

  client.on('nextApproved', function(data) {
    console.log('nextApproved', data);

    var voice_id = parseInt(data.id, 10);

    knex('posts').where({'approved': true, 'voice_id' : voice_id}).orderBy('id', 'desc').limit(120).offset((data.page -1) * 120).asCallback(function(err, posts) {

      client.emit('page', {
        posts : posts,
        page : data.page,
        pages : data.pages
      });
    })
  });

  // Unapproved Posts

  client.on('unapproved', function(data) {
    console.log('unapproved', data);

    var voice_id = parseInt(data.id, 10);

    knex('posts').where({'approved': false, 'voice_id' : voice_id}).limit(10000).asCallback(function(err, total) {
      var pages = Math.round(total.length / 120);



      knex('posts').where({'approved': false, 'voice_id' : voice_id}).orderBy('id', 'desc').limit(120).asCallback(function(err, posts){
        client.emit('firstPage', {
          posts : posts,
          page : 1,
          pages : pages
        });
      });
    });
  });

  client.on('nextUnapproved', function(data) {
    console.log('nextUnapproved', data);

    var voice_id = parseInt(data.id, 10);

    knex('posts').where({'approved': false, 'voice_id' : voice_id}).orderBy('id', 'desc').limit(120).offset((data.page -1) * 120).asCallback(function(err, posts) {

      client.emit('page', {
        posts : posts,
        page : data.page,
        pages : data.pages
      });
    })
  })
});


// connection.end();
