import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDashboardButton, setShowDashboardButton] = useState(false);
  const navigate = useNavigate();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return; // Prevent empty messages

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) throw new Error(`Failed to fetch response: ${response.statusText}`);

      const data = await response.json();
      let botResponse = data.answer || "Sorry, I couldn't generate a response.";

      // Check for visualization trigger keywords
      const lowerCaseMessage = userMessage.toLowerCase();
      const visualizationKeywords = ["pie chart", "pie", "proportions", "expense breakdown", "distributions"];

      if (visualizationKeywords.some((keyword) => lowerCaseMessage.includes(keyword))) {
        botResponse = "Your requested chart is available in the Dashboard.";

        const visualizationData = {
          type: "pie",
          labels: ["Rent", "Food", "Entertainment", "Transport", "Savings"],
          values: [500, 300, 200, 150, 100],
        };

        // Update localStorage and force update in Dashboard
        localStorage.setItem("visualizationData", JSON.stringify(visualizationData));
        console.log("Visualization Data Set:", visualizationData); // Debugging log

        setShowDashboardButton(true);
      } else {
        setShowDashboardButton(false); // Hide button if not a visualization request
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
      setUserMessage(""); // Reset input field after successful response
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error fetching response. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <h1>Chat with FinSage</h1>
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
          {loading && <p>Loading...</p>}
        </div>
        
        <form className="message-form" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            disabled={loading} // Disable input while loading
          />
          <button type="submit" disabled={loading}>Send</button>
        </form>

        {/* View Dashboard Button */}
        {showDashboardButton && (
          <div className="dashboard-button-container">
            <button className="visualize-button" onClick={() => navigate("/dashboard")}>
              View Full Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
