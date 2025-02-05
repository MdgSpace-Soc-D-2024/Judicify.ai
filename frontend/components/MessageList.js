import React from 'react';

function MessageList({ messages }) {
    return (
        <div className="message-list">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={msg.system ? 'message system-message' : 'message user-message'}
                >
                    {msg.system ? (
                        <p>{msg.message}</p>
                    ) : (
                        <p>
                            <strong>{msg.sender}</strong>: {msg.message}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MessageList;
