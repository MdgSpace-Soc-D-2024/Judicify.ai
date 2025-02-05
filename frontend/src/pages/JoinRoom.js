import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess } from "../utils";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleHome = (e) => {
    navigate('/home')
}

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        handleError("Please log in to join a room.");
        return;
      }

      const url = `http://localhost:1818/rooms/${roomId}/join`;

      const response = await axios.post(
        url,
        { roomId },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const { message } = response.data;

      if (response.status === 200) {
        handleSuccess("Joining your room");
        // navigate(`/room/${roomId}`);
        setTimeout(() => {
          navigate(`/room/${roomId}`);
        }, 1000);
      }
      if (response.status === 403) {
        handleError(message);
      }
      if (response.status === 404){
        handleError(message)
      }
    } catch (error) {
      console.error(error);
      handleError(error.response?.data?.message || "Failed to join room.");
    }
  };

  return (
    <div className="join-room-container">
      <h2>Join a Room</h2>
      <form onSubmit={handleJoinRoom}>
        <div className="form-group">
          <label htmlFor="roomId">Enter Room ID</label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Join Room
          </button>
        </div>
        <div>
          <button onClick={handleHome} className="btn btn-primary">
            Home
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default JoinRoom;


