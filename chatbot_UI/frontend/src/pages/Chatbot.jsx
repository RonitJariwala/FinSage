import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Chatbot.css";
import logo from "./logo.png";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInputFields, setShowInputFields] = useState(false);
  const [visualizationType, setVisualizationType] = useState(null);
  const [categories, setCategories] = useState("");
  const [values, setValues] = useState("");
  const [xAxisLabels, setXAxisLabels] = useState("");
  const [yAxisValues, setYAxisValues] = useState("");
  const [stackedCategories, setStackedCategories] = useState("");
  const [stackedFixed, setStackedFixed] = useState("");
  const [stackedVariable, setStackedVariable] = useState("");
  const [scatterX, setScatterX] = useState("");
  const [scatterY, setScatterY] = useState("");

  const chatWindowRef = useRef(null);
  const inputContainerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load chat history from localStorage when component mounts or route changes
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Error parsing chat history:", error);
      }
    }
  }, [location.pathname]);

  // Save chat history whenever messages change
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom when new messages are added
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

  // Send user message and fetch bot response
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

      const pieKeywords = [
        "pie chart",
        "pie",
        "proportions",
        "expense breakdown",
        "distributions",
        "doughnut chart",
        "ring chart",
        "budget breakdown",
        "spending distribution",
        "percentage breakdown"
      ];

      const lineKeywords = [
        "line graph",
        "line chart",
        "trend",
        "time series",
        "growth trend",
        "savings trend",
        "performance trend",
        "progress over time",
        "continuous data",
        "sequential data"
      ];

      const stackedKeywords = [
        "stacked bar",
        "stacked bar chart",
        "stacked column",
        "cumulative expenses",
        "expense breakdown",
        "expense stack",
        "bar breakdown",
        "layered bar",
        "grouped stacked"
      ];

      const scatterKeywords = [
        "scatter plot",
        "scatter",
        "scatter diagram",
        "dot plot",
        "correlation",
        "relationship",
        "financial correlation",
        "data distribution",
        "point plot",
        "dispersion plot"
      ];

      const lowerQuery = userMessage.toLowerCase();
      if (pieKeywords.some((keyword) => lowerQuery.includes(keyword))) {
        botResponse = "Please enter categories and values for your pie chart.";
        setVisualizationType("pie");
        setShowInputFields(true);
      } else if (lineKeywords.some((keyword) => lowerQuery.includes(keyword))) {
        botResponse = "Please enter details for your monthly savings trends.";
        setVisualizationType("line");
        setShowInputFields(true);
      } else if (stackedKeywords.some((keyword) => lowerQuery.includes(keyword))) {
        botResponse = "Please enter details for your fixed vs. variable expenses chart.";
        setVisualizationType("stacked");
        setShowInputFields(true);
      } else if (scatterKeywords.some((keyword) => lowerQuery.includes(keyword))) {
        botResponse = "Please enter details for your income vs. spending comparison.";
        setVisualizationType("scatter");
        setShowInputFields(true);
      } else {
        setShowInputFields(false);
        setVisualizationType(null);
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error fetching response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle visualization data submission
  const handleSubmitData = () => {
    if (visualizationType === "pie") {
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
      const total = valueList.reduce((acc, curr) => acc + curr, 0);
      if (total === 0) {
        alert("Total value cannot be zero.");
        return;
      }
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
    } else if (visualizationType === "line") {
      if (!xAxisLabels.trim() || !yAxisValues.trim()) {
        alert("Please enter both months and savings amounts.");
        return;
      }
      const labelList = xAxisLabels.split(",").map((l) => l.trim());
      const valueList = yAxisValues.split(",").map((v) => parseFloat(v.trim()));
      if (labelList.length !== valueList.length || valueList.some(isNaN)) {
        alert("Each month must have a corresponding numeric savings amount.");
        return;
      }
      localStorage.setItem(
        "visualizationData",
        JSON.stringify({
          type: "line",
          labels: labelList,
          values: valueList,
        })
      );
    } else if (visualizationType === "stacked") {
      if (!stackedCategories.trim() || !stackedFixed.trim() || !stackedVariable.trim()) {
        alert("Please enter categories, fixed expense values, and variable expense values.");
        return;
      }
      const categoryList = stackedCategories.split(",").map((c) => c.trim());
      const fixedList = stackedFixed.split(",").map((v) => parseFloat(v.trim()));
      const variableList = stackedVariable.split(",").map((v) => parseFloat(v.trim()));
      if (
        categoryList.length !== fixedList.length ||
        categoryList.length !== variableList.length ||
        fixedList.some(isNaN) ||
        variableList.some(isNaN)
      ) {
        alert("Each category must have corresponding numeric fixed and variable values.");
        return;
      }
      localStorage.setItem(
        "visualizationData",
        JSON.stringify({
          type: "stacked",
          labels: categoryList,
          fixed: fixedList,
          variable: variableList,
        })
      );
    } else if (visualizationType === "scatter") {
      if (!scatterX.trim() || !scatterY.trim()) {
        alert("Please enter both income and spending amounts.");
        return;
      }
      const xValues = scatterX.split(",").map((v) => parseFloat(v.trim()));
      const yValues = scatterY.split(",").map((v) => parseFloat(v.trim()));
      if (xValues.length !== yValues.length || xValues.some(isNaN) || yValues.some(isNaN)) {
        alert("Each income value must have a corresponding numeric spending amount.");
        return;
      }
      localStorage.setItem(
        "visualizationData",
        JSON.stringify({
          type: "scatter",
          x: xValues,
          y: yValues,
        })
      );
    }

    const finalMessages = [
      ...messages,
      { sender: "bot", text: "Data received! Redirecting to dashboard..." },
    ];
    setMessages(finalMessages);
    localStorage.setItem("chatHistory", JSON.stringify(finalMessages));
    setTimeout(() => {
      setShowInputFields(false);
      navigate("/dashboard");
    }, 1000);
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
                Ask me about personal finance, budgeting, investments, or charting your data.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender}`}
                style={{
                  alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
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
            {visualizationType === "pie" && (
              <>
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
              </>
            )}
            {visualizationType === "line" && (
              <>
                <h3>Enter Line Graph Details:</h3>
                <input
                  type="text"
                  placeholder="Enter months (comma-separated)"
                  value={xAxisLabels}
                  onChange={(e) => setXAxisLabels(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter savings amounts (comma-separated)"
                  value={yAxisValues}
                  onChange={(e) => setYAxisValues(e.target.value)}
                />
              </>
            )}
            {visualizationType === "stacked" && (
              <>
                <h3>Enter Stacked Bar Chart Details:</h3>
                <input
                  type="text"
                  placeholder="Enter categories (comma-separated)"
                  value={stackedCategories}
                  onChange={(e) => setStackedCategories(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter fixed expense values (comma-separated)"
                  value={stackedFixed}
                  onChange={(e) => setStackedFixed(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter variable expense values (comma-separated)"
                  value={stackedVariable}
                  onChange={(e) => setStackedVariable(e.target.value)}
                />
              </>
            )}
            {visualizationType === "scatter" && (
              <>
                <h3>Enter Scatter Plot Details:</h3>
                <input
                  type="text"
                  placeholder="Enter income values (comma-separated)"
                  value={scatterX}
                  onChange={(e) => setScatterX(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter spending amounts (comma-separated)"
                  value={scatterY}
                  onChange={(e) => setScatterY(e.target.value)}
                />
              </>
            )}
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