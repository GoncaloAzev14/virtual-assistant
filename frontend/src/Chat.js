import React, { useState } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    // Send the user's message to the server and get the chatbot's response
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: input }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
  
    // Add the user's message and the chatbot's response to the messages array
    setMessages([...messages, { text: input, sender: 'user' }, { text: data.message, sender: 'bot' }]);
  
    // Clear the input field
    setInput('');
  };
  

  return (
    <div>
      {messages.map((message, index) => (
        <p key={index}><b>{message.sender}:</b> {message.text}</p>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
