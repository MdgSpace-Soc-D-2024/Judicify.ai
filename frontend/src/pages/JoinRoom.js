import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleSuccess, handleError } from '../utils'


function JoinRoom(){


    const navigate = useNavigate()
    const[JoinRoomInfo, setJoinRoomInfo] = useState({
        roomId:"",
        email:"",
    })

    const handleChange = (e) => {
        const{name, value} = e.target;
        const copyJoinRoomInfo = {...JoinRoomInfo};
        copyJoinRoomInfo[name] = value;
        setJoinRoomInfo(copyJoinRoomInfo)
    }

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        const {roomId, email} = JoinRoomInfo
        if(!email ||!roomId){
            return handleError("All fields are required, try again!")
        }
        try{
            const url = "http://localhost:1818/join-room/"
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({roomId, email})
            })

            const result = await response.json();
            if (result.success === true) {
                handleSuccess(result.message);
                setTimeout(() => {
                    navigate(`/room/${roomId}`); 
                }, 1000); 
            } else {
                handleError(result.message); 
            }
        } catch(err){
            handleError(err)
        }
    }

    return(
        <div className="container">
            <h1>Join a Room</h1>
            <form onSubmit={handleJoinRoom}>
                <div>
                    <label htmlFor='roomId'>Enter Room ID</label>
                    <input 
                        onChange={handleChange}
                        type='text'
                        name='roomId'
                        autoFocus
                        placeholder='Enter room ID...'
                        value={JoinRoomInfo.roomId}
                    />
                </div>
                <div>
                    <label htmlFor='email'> Enter your Email</label>
                    <input
                        onChange={handleChange} 
                        type='text'
                        name='email'
                        autoFocus
                        placeholder='Enter your email...'
                        value={JoinRoomInfo.email}
                    />
                </div>
                <button type='submit'>Enter Room</button>
                <span>
                    Create a room insted
                    <Link to ="/room/create">Create Room</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}
export default JoinRoom