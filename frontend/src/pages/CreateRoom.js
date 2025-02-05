import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../utils';
import { ToastContainer } from 'react-toastify';
import { jwtDecode } from './Room';

function CreateR() {
    const [caseId, setcaseId] = useState('');
    const [participants, setParticipants] = useState(['']);
    const [scheduledTime, setScheduledTime] = useState('');
    const navigate = useNavigate();
    const [judgeId, setJudgeId] = useState('')

    useEffect(() => {
            const token = localStorage.getItem('jwtToken');
            console.log(token);
            if (token) {
                try {
                    const decodedPayload = jwtDecode(token);
                    setJudgeId(decodedPayload._id);
                    
                } catch (error) {
                    console.error("Error decoding the token:", error);
                    handleError("Failed to decode token");
                }
            }
        }, []);

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('http://localhost:1818/rooms/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('jwtToken')}`
                    },
                    body: JSON.stringify({ caseId, participants, scheduledTime, judgeId })
            });
                
            const result = await response.json();
            if (result.success) {
                navigate('/room');
                handleSuccess(result.message);
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    const handleAddParticipant = () => setParticipants([...participants, '']);

    return (
        <div>
            <h1>Create a Chat Room</h1>
            <form onSubmit={handleSubmit}>
                <label>Case Number:</label>
                <input type="text" value={caseId} onChange={(e) => setcaseId(e.target.value)} required />
                <label>Participants' Emails:</label>
                {participants.map((email, index) => (
                    <input
                        key={index}
                        type="email"
                        value={email}
                        onChange={(e) => setParticipants(participants.map((p, i) => i === index ? e.target.value : p))}
                    />
                ))}
                <button type="button" onClick={handleAddParticipant}>Add Participant</button>
                <label>Scheduled Time:</label>
                <input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} required />
                <button type="submit">Create Room</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default CreateR;
