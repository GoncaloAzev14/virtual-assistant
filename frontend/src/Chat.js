import React, { useState } from 'react';
import { franc } from 'franc-min';
import langs from 'langs';

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

      // Speak the AI response with language detection
      const detectedLanguage = franc(data.message);
      speakText(data.message, detectedLanguage);

      setUserInput('');
    } catch (error) {
      console.error('Error during chat interaction:', error);
    }
  };

  const speakText = async (text, detectedLanguage) => {
    if (!window.speechSynthesis) {
      console.error('Speech Synthesis API not supported');
      alert('Your browser does not support text-to-speech functionality.');
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    // Convert ISO 639-3 code to ISO 639-1
    const langISO1 = langs.where('3', detectedLanguage)['1'];

    // Find a matching voice for the detected language
    let voice = speechSynthesis.getVoices().find(voice => voice.lang.startsWith(langISO1));
    if (!voice) {
      console.warn(`No voice found for language: ${langISO1}, using default`);
      voice = speechSynthesis.getVoices()[0]; // Default voice if no match
    }
    speech.voice = voice;

    speechSynthesis.speak(speech);

    // ... (Optional) Add event listeners for speech events
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
