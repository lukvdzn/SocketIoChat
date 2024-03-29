const PORT = 3000;
const connectedUsers = [];


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
        const userindex = connectedUsers.findIndex((value) => {
            return value.id == socket.id;
        });
        
        //user object
        const user = connectedUsers[userindex];

        //remove disconnected user
        if(userindex >= 0){            
            connectedUsers.splice(userindex, 1);
            const name = user != undefined ? user.name : "anon";
            console.log(`${name} disconnected`);
            if(name != "anon")
                io.emit('user left', `${name} has left the chat!`);
        }
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

    //when a client enters its username
    socket.on('client user name', name => {
        connectedUsers.push({name: name, id: socket.id});
        console.log(connectedUsers);

        io.emit('user joined', `${name} has joined the chat!`);
    });

    socket.on('show users', _ => {
        //send userlist to client which queried
        io.to(socket.id).emit('show users', connectedUsers);
    });

    socket.on('user not submitting', _ => {
        console.log("USER NOT SUBITTING");
        io.emit('user not submitting');
    });

});

//listen on port PORT
http.listen(PORT, function(){
    console.log("LISTENING ON PORT 3000");
});