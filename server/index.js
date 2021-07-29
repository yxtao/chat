const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
dotenv = require('dotenv').config();

const { addUser, removeUser, getUser, getUserInRoom } = require("./users");

const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    authenticator: new IamAuthenticator({
      apikey: process.env.APIKEY,
    }),
    serviceUrl: process.env.URL,
  });

 const translate = async (translateParams, user, io, message)=> {
     try{
        const result = await languageTranslator.translate(translateParams)
        const translatedMessage = result["result"]["translations"][0]["translation"]
        console.log(result["result"]["translations"][0]["translation"])
        io.to(user.room).emit('message', {user:user.name, text: message+" >> "+translatedMessage});
     }catch(error){
        io.to(user.room).emit('message', {user:user.name, text: message});
     }
 }

const PORT = process.env.PORT || 5000 ;

const app = express();
app.use(router);
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket)=>{
  
    socket.on('join', ({name, room, model}, callback )=>{
        const {error, user } = addUser ({id: socket.id, name:name, room:room})
        if(error) return callback({error:error, user:null});
        socket.emit('message', {user:'admin', text: `${user.name.toUpperCase()}, welcome to room ${user.room}`});
        const users = getUserInRoom(user.room)
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text:`${user.name.toUpperCase()}, has joined! `})
        socket.join(user.room)
        
        io.to(user.room).emit('roomData',{room: user.room, users:getUserInRoom(user.room)})
        callback({error:null,user:user});
    })

    socket.on('sendMessage',(message, model, callback) =>{
        let info = null;
        const user = getUser(socket.id);
        if(!(user&& user.room)) {
            info = "you have logged out, please leave and join the room again";
            callback(info);
            return 
        }
        console.log("model", model)
        const translateParams = {text: message, modelId:model }

        translate(translateParams, user, io, message)
        io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)});
        callback(info);
    })

    socket.on("leave", ()=>{
       
        const user = removeUser (socket.id);  
        if(!(user&& user.room)) return 
        if(user){
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name.toUpperCase()} has left `});     
        }
    })
    socket.on('disconnect',()=>{
        const user = removeUser (socket.id);
       
        if(user){
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name.toUpperCase()} has left `});     
        }
    })
});

server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`))