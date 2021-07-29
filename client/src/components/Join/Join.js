import React , { useState }from 'react';
import { Link } from 'react-router-dom';
import './Join.css'

const Joint = ()=>{
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [modelId, setModelId] = useState('')

    // const handleModel = (e) =>{
    // setModelId(model);
    //  }

    return(
     <>
     <div className = "welcome">Welcome to real time chatting space</div>
    <div className="outerbox">
        <div className="innerbox">
            <input className="inputbox" placeholder="Name"  type="text"  onChange={(event)=> setName(event.target.value)} required/>
        </div>
        <div className="innerbox"> 
            <input className="inputbox" placeholder="Room"  type="text"  onChange={(event)=> setRoom(event.target.value)} required/>
        </div>
       
        <div className="innerbox">
            <div className="dropdown" >
               language choice
            </div>  
             <div className="dropdown">
                 <select name="selectList" id="selectList" onChange={(e)=> setModelId(e.target.value)} className="dropdown-content">
                 <option value=''>None</option>   
                  <option value='en-es'>English to Spanish</option>
                  <option value="es-en">Spanish to English</option>
                  <option value="en-zh">English to Chinese</option>
                  <option value="zh-en">Chinese to English</option>
                </select>
             </div>
        </div>
        <div className="innerbox">
            <Link onClick ={event => (!name || !room)? event.preventDefault() : null}  
                to={`/chat?name=${name}&room=${room}&model=${modelId}`}>
                <button className="btnSubmit" type="submit">Sign in </button>
            </Link>
        </div>
    </div>
    </>
    )
}
export default Joint;