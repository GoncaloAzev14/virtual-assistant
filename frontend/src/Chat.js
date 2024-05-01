import React, { useState } from 'react';

const Chat = () => {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userInput, setUserInput] = useState('');

  const sendMessage = async () => {
    if (!userInput.trim()) {
      return;
    }

    try {
      // Backend endpoint URL (replace with your actual URL)
      const chatEndpoint = 'http://localhost:3001/chat';

      // Send user input to backend using Fetch API
      const response = await fetch(chatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });

      console.log(response);

      // Check for successful response
      if (!response.ok) {
        throw new Error(`Error sending message: ${response.statusText}`);
      }

      const data = await response.json(); // Parse JSON response

      // Update conversation history with user input and AI response
      setConversationHistory([...conversationHistory, { role: 'user', content: userInput }]);
      setConversationHistory([...conversationHistory, { role: 'assistant', content: data.message }]);

      // Speak the AI response (text-to-speech functionality)
      speakText(data.message);

      setUserInput('');
    } catch (error) {
      console.error('Error during chat interaction:', error);
    }
  };

  const speakText = async (text) => {
    if (!window.speechSynthesis) {
      console.error('Speech Synthesis API not supported');
      alert('Your browser does not support text-to-speech functionality.');
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    // Set voice options (optional)
    speech.voice = speechSynthesis.getVoices()[0]; // Default voice
    speech.pitch = 1; // Adjust pitch (1 is normal)
    speech.rate = 1; // Adjust playback rate (1 is normal)

    speechSynthesis.speak(speech);  // Start speaking

    // Add event listeners for speech events (optional)
    speech.onend = () => {
      console.log('Speech finished');
    };
    speech.onerror = (error) => {
      console.error('Error during speech synthesis:', error);
    };
  };

  return (
    <div>
      <ul>
        {conversationHistory.map((message, index) => (
          <li key={index}>
            {message.role === 'user' ? 'Você: ' : 'Assistente: '}
            {message.content}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={(e) => { if (e.key === 'Enter') { sendMessage(); }}}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default Chat;
