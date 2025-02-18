import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";
import logo from "./logo.png";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInputFields, setShowInputFields] = useState(false);
  const [categories, setCategories] = useState("");
  const [values, setValues] = useState("");
  const chatWindowRef = useRef(null);
  const inputContainerRef = useRef(null);
  const navigate = useNavigate();

  // Load chat history on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save chat history when messages change
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll the chat window when messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Scroll input fields into view when they appear
  useEffect(() => {
    if (showInputFields && inputContainerRef.current) {
      inputContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showInputFields]);

  // Send user message to the backend and handle response
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    const newMessage = { sender: "user", text: userMessage };
    setMessages((prev) => [...prev, newMessage]);
    setUserMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      let botResponse = data.answer || "Sorry, I couldn't generate a response.";

      // Check for visualization keywords
      const visualizationKeywords = [
        "pie chart",
        "pie",
        "proportions",
        "expense breakdown",
        "distributions",
      ];
      if (
        visualizationKeywords.some((keyword) =>
          userMessage.toLowerCase().includes(keyword)
        )
      ) {
        botResponse = "Please enter categories and values for your pie chart.";
        setShowInputFields(true);
      } else {
        setShowInputFields(false);
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Error fetching response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle submission of pie chart data
  const handleSubmitData = () => {
    if (!categories.trim() || !values.trim()) {
      alert("Please enter both categories and values.");
      return;
    }

    const categoryList = categories.split(",").map((c) => c.trim());
    const valueList = values.split(",").map((v) => parseFloat(v.trim()));

    if (categoryList.length !== valueList.length || valueList.some(isNaN)) {
      alert("Each category must have a corresponding numeric value.");
      return;
    }

    // Calculate the total of values
    const total = valueList.reduce((acc, curr) => acc + curr, 0);
    // Calculate percentages for each value (rounded to 2 decimals)
    const percentageList = valueList.map((value) =>
      Number(((value / total) * 100).toFixed(2))
    );

    localStorage.setItem(
      "visualizationData",
      JSON.stringify({
        type: "pie",
        labels: categoryList,
        values: percentageList,
      })
    );

    setShowInputFields(false);
    navigate("/dashboard");
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <h1>Chat with FinSage</h1>

        <div className="chat-window" ref={chatWindowRef}>
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="welcome-container">
                <p className="welcome-text">
                  Welcome to <span className="brand-name">FinSage</span>
                  <img src={logo} alt="FinSage Logo" className="chatbot-logo" />
                </p>
              </div>
              <p>
                Ask me about personal finance, budgeting, or investments.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender}`}
                style={{
                  alignSelf:
                    message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <p>{message.text}</p>
                <span className="message-time">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}
          {loading && (
            <div className="loading">
              <div className="typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
        </div>

        <form className="message-form" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            Send
          </button>
        </form>

        {showInputFields && (
          <div className="input-container" ref={inputContainerRef}>
            <h3>Enter Pie Chart Details:</h3>
            <input
              type="text"
              placeholder="Enter categories (comma-separated)"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter values (comma-separated)"
              value={values}
              onChange={(e) => setValues(e.target.value)}
            />
            <button type="button" onClick={handleSubmitData}>
              Submit Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;