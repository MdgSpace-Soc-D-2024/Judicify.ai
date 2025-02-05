import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../utils';
import { ToastContainer } from 'react-toastify';

export const jwtDecode = (token) => {
    const arrayToken = token.split('.');
    if (arrayToken.length !== 3) {
        throw new Error('Invalid JWT token');
    }

    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    return tokenPayload;
};

function Room() {
    const [loggedinUser, setLoggedInUser] = useState("");
    const [isJudge, setIsJudge] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            navigate('/login');
            return;
        }
        setLoggedInUser(localStorage.getItem('loggedinUser'));
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const decodedPayload = jwtDecode(token);
                setIsJudge(decodedPayload.judge);
            } catch (error) {
                console.error("Error decoding the token:", error);
                handleError("Failed to decode token");
            }
        }
        setLoggedInUser(localStorage.getItem('loggedinUser'))
    }, []);

    const handleLogout = (e) => {
        localStorage.removeItem('loggedinUser');
        localStorage.removeItem('jwtToken');
        handleSuccess('User logged out!');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const handleHome = (e) => {
        navigate('/home');
    };

    const handleJoinRoom = (e) => {
        navigate('/room/join');
    };

    const handleCreateRoom = () => {
        if (isJudge) {
            navigate('/room/create');
        } else {
            handleError("Only judges can create a room");
        }
    };

    return (
        <div>
            <h1>Welcome to Room Section {loggedinUser}!</h1>
            <button onClick={handleLogout}>Logout</button>
            <br /><br />
            <button onClick={handleJoinRoom}>Join a Room</button>
            {isJudge && (
            <button onClick={handleCreateRoom}>Create a Room</button>
            )}
            <button onClick={handleHome}>Home</button>
            <ToastContainer />
        </div>
    );
}

export default Room;

