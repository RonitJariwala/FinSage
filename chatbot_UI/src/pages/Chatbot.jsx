import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');


  const sendMessage = (e) => {
    e.preventDefault();

    if (userMessage.trim() === '') return;


    const newMessages = [...messages, { sender: 'user', text: userMessage }];

    const botResponse = { sender: 'bot', text: `You said: ${userMessage}` };
    newMessages.push(botResponse);

    setMessages(newMessages);
    setUserMessage('');
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        {/* Chatbot Section */}
        <div className="chatbot">
          <h1>Chat with FINSAGE</h1>
          <p>Start a conversation with the bot to get financial advice and insights.</p>
          {/* Chat Window */}
          <div className="chat-window">
            {messages.length === 0 ? (
              <p>No messages yet. Start the conversation!</p>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`chat-message ${message.sender}`}>
                  <p>{message.text}</p>
                </div>
              ))
            )}
          </div>
          <form className="message-form" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
        <div className="visualization">
          <h2>Financial Insights</h2>
          <div className="chart-container">
            <p>Visualization of financial data goes here...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

