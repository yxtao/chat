import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';
let socket;

const Chat = ( props )=> {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const[error, setError] = useState();
    const ENDPOINT = 'localhost:5000';

    useEffect (()=>{
        const data = queryString.parse(props.location.search);
        const { name, room } = data;

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);
        
        socket.emit('join', {name: name, room:room}, ({error, user})=>{
            if(error) {
                alert(error);
                setError(error)
              } else if (user){
                  console.log(user);
              }else{
                  console.log("error in Chat.js line 34")
              }
           
         });
        
         console.log("called")
         console.log(users)
         return ()=>{
            socket.emit('disconnect');
            socket.off();
            console.log("disconnect called")
            console.log(users)
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
            socket.emit('sendMessage', message, ()=> setMessage(''))
        }   
    }

    const handleLeave=()=>{
        socket.emit('disconnect');
        socket.off();
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
   if (error !=null) 
    return (
    <div>choose a different name 
        <Link to="/">
                <button className="btnSubmit" type="submit" onClick={ handleLeave } > Leave </button>
            </Link>
    </div>)
    
    return (
        <>
        <div className = "room">
            room {room}  <br/>
        <Link to={"/"}>
             <button className="btnSubmit" type="submit"> Leave </button>
        </Link> 
        </div>
        <div className="chatContent">
            <div className="messageBox">
                { messages.map((message, i)=>
                <div className="messageItem"  key={i}> 
                  <div style={message.user === name.trim().toLowerCase()? userStyle : guestStyle}> 
                     <span className="userName">{message.user.replace(/\b(\w)/g, s => s.toUpperCase())} : </span>
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