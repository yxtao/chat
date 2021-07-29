import React , { useState }from 'react';
import { Link } from 'react-router-dom';
import './Join.css'

const Joint = ()=>{
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return(
     <>
     <div className = "welcome">Welcome to real time chatting space</div>
    <div className="outerbox">
        <div className="innerbox">
            <input className="inputbox" placeholder="Name"  type="text"  onChange={(event)=> setName(event.target.value)} />
        </div>
        <div className="innerbox"> 
            <input className="inputbox" placeholder="Room"  type="text"  onChange={(event)=> setRoom(event.target.value)} />
        </div>
        <div className="innerbox">
            <Link onClick ={event => (!name || !room)? event.preventDefault() : null}  
                to={`/chat?name=${name}&room=${room}`}>
                <button className="btnSubmit" type="submit">Sign in </button>
            </Link>
        </div>
    </div>
    </>
    )
}
export default Joint;