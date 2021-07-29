import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';
let socket;

const Chat = ( props )=> {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [model, setModel] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [leave, SetLeave] = useState(false)
    const ENDPOINT = 'localhost:5000';

    useEffect (()=>{
        const data = queryString.parse(props.location.search);
        const { name, room , model } = data;

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);
        setModel(model);

        socket.emit('join', {name: name, room:room, model: model}, ({error, user})=>{
            if(error) {
                alert(error);
              }  
         }); 
         console.log("called")
          return ()=>{
            socket.emit('disconnect');
             socket.off();
         }
    },[ENDPOINT, props.location.search])


    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages, message]);
        });
        socket.on("roomData", ({ users }) => {
            setUsers(users);
            console.log(users)
          });
    }, [messages])
   

    const sendMessage = (event)=>{
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, model, (info)=> {
                setMessage('');    
                if(info){
                    alert(info)
                }    
            })
        }
    }

    const handleLeave=()=>{
        socket.emit('leave');
        socket.emit('disconnect');
        socket.off();
        SetLeave(true);
    }
   const guestStyle = {
       color:"grey",
       float:"left",
       width:"70%"     
   }

   const userStyle = {
       color:"black",
       float:"right",
       width: "70%",
       padding: "20px",
       backgroundColor:"antiquewhite",
   }
   if ( leave == true ) 
    return (
    <div className = "room">
        <Link to="/">
                <button className="btnSubmit" type="submit" > Join</button>
            </Link>
    </div>)
    
    return (
        <>
        <div className = "room">
            room {room}  <br/>
          <button className="btnSubmit" type="submit" onClick={handleLeave}> Leave </button>
        </div>
        <div className="chatContent">
            <div className="messageBox">
                { messages.map((message, i)=>
                <div className="messageItem"  key={i}> 
                  <div style={message.user === name.trim().toLowerCase()? userStyle : guestStyle}> 
                     <span className="userName">{message.user&&message.user.replace(/\b(\w)/g, s => s.toUpperCase())} : </span>
                     {message.text} 
                  </div>
                 </div>)}
            </div>
            <div className="inputDiv">
                <input className="messageInput" value={message} onChange ={(event)=>setMessage(event.target.value)}
                 onKeyPress={event => event.key ==="Enter"? sendMessage(event): null}
                />
            </div>
        </div>
        </>
    )
}

export default Chat;