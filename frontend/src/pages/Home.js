import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess} from '../utils';
import { ToastContainer } from 'react-toastify';

function Home() {
    const [loggedinUser, setLoggedInUser] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedinUser'));
    }, []);

    const handleLogout = (e) => {
        localStorage.removeItem('loggedinUser');
        localStorage.removeItem('jwtToken');
        handleSuccess('User logged out!');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const handleFeature1 = (e) => {
        navigate('/room/');
    };

    const handleFeature2 = (e) => {
        navigate('/advisory');
    };

    return (
        <div>
            <h1>Welcome {loggedinUser} !</h1>
            <button onClick={handleLogout}>Logout</button>
            <br /><br />
            <button onClick={handleFeature1}>Join or Create Room</button>
            <button onClick={handleFeature2}>Legal Advisory Section</button>
            <br /><br />
            <button onClick={handleFeature1}>Join or Create Room</button>
            <button onClick={handleFeature2}>Legal Advisory Section</button>
            <ToastContainer />
        </div>
    );
}

export default Home;
