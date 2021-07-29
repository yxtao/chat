const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const { addUser, removeUser, getUser, getUserInRoom } = require("./users");

const PORT = process.env.PORT || 5000 ;

const app = express();
app.use(router);
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket)=>{
    socket.on('join', ({name, room}, callback )=>{
        const {error, user } = addUser ({id: socket.id, name:name, room:room})
        if(error) return callback({error:error, user:null});
        socket.emit('message', {user:'admin', text: `${user.name.toUpperCase()}, welcome to room ${user.room}`});
        const users = getUserInRoom(user.room)
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text:`${user.name.toUpperCase()}, has joined! `})
        socket.join(user.room)
        
        io.to(user.room).emit('roomData',{room: user.room, users:getUserInRoom(user.room)})
        callback({error:null,user:user});
    })
    
    socket.on('sendMessage',(message, callback) =>{
        const user = getUser(socket.id);
        io.to(user.room).emit('message', {user:user.name, text: message});
        io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)});
        callback();
    })
    socket.on('disconnect',()=>{
        const user = removeUser (socket.id);
       
        if(user){
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name.toUpperCase()} has left `});     
        }
    })
});

server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`))