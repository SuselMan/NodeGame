/**
 * Created by pavluhin on 10.11.2016.
 */

var app = require('express')();
var express =require('express');
var http = require('http').Server(app);
var io = require('socket.io').listen(8888);



app.use(express.static(__dirname + '/public'));
app.listen(8080);

var socketsArr=[];

io.on('connection', function(socket){
    console.log('a user connected');
    socketsArr.push(socket);
    var ID = (socket.id).toString().substr(0, 5);
    for(var i=0;i<socketsArr.length;i++){
        socketsArr[i].json.send({'event': 'connected', 'name': socketsArr.length + ' '});
    }
});


// var http = require("http");
// var express = require('express');
// var app = express();
// var io = require('socket.io').listen(8888);
//
// app.use(express.static(__dirname + '/public'));
// app.listen(8080);
//
//
// io.sockets.on('connection', function (socket) {
//     var ID = (socket.id).toString().substr(0, 5);
//     var time = (new Date).toLocaleTimeString();
//     socket.json.send({'event': 'connected', 'name': ID, 'time': time});
// });
