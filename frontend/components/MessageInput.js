import React, { useState } from 'react';

function MessageInput({ onSendMessage }) {
    const [message, setMessage] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form className="message-input-container" onSubmit={handleSend}>
            <input
                type="text"
                className="message-input"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="send-btn">
                Send
            </button>
        </form>
    );
}

export default MessageInput;
