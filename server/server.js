const PORT = 3000;

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//load seperate files in index.html such as .css, scripts..
app.use(express.static('public'));

//send the html document to client
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//client socket connected
io.on('connection', socket => {
    console.log("user connected");
    
    //one client disconnected
    socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    
    //one client sent a message
    socket.on('chat message', user => {
        io.emit('chat message', user);
        console.log(`${user.name}, message: ${user.text}`);
    });

    // a client is typing a message
    socket.on('user typing', msg => {
        io.emit('user typing', msg);
    });
});

//listen on port PORT
http.listen(PORT, function(){
    console.log("LISTENING ON PORT 3000");
});