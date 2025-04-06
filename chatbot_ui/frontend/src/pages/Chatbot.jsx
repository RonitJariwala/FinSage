import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./Chatbot.css";
import logo from "./logo.png";

// Icon paths from your public folder
const sendIcon = "/square-arrow-up-right-solid.svg";
const microphoneIcon = "/microphone-solid.svg";
const microphoneSlashIcon = "/microphone-slash-solid.svg";

// Function to format the bot response
const formatBotResponse = (text) => {
  if (!text) return { __html: text };

  let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  const lines = formattedText.split("\n").map(line => line.trim());
  let hasList = false;
  const formattedLines = lines.map(line => {
    if (/^\s*[-*]\s+/.test(line)) {
      hasList = true;
      return `<li>${line.replace(/^\s*[-*]\s+/, "").trim()}</li>`;
    }
    return line;
  }).join("\n");

  if (hasList) {
    formattedText = `<ul>${formattedLines}</ul>`;
  } else {
    formattedText = formattedLines;
  }

  formattedText = formattedText.replace(/^\s*[-*]\s+/gm, "• ");

  return { __html: formattedText };
};

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
  const [scatterX, setScatterX] = useState(0);
  const [scatterY, setScatterY] = useState(0);;

  const [isListening, setIsListening] = useState(false);
  const chatWindowRef = useRef(null);
  const inputContainerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (showInputFields && inputContainerRef.current) {
      inputContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showInputFields]);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Error parsing chat history:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const handleUserMessage = useCallback(async (messageText) => {
    const newMessage = { sender: "user", text: messageText };
    setMessages((prev) => [...prev, newMessage]);
    setUserMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5001/api/query", {
        query: messageText,
      });
      if (!response.data) throw new Error("No response data");

      let botResponse = response.data.answer || "I'm sorry, I couldn't understand your request.";

      // Existing visualization logic
      const pieKeywords = ["pie chart", "pie", "proportions", "expense breakdown"];
      const lineKeywords = ["line graph", "line chart", "trend", "time series"];
      const stackedKeywords = ["stacked bar", "stacked bar chart", "stacked column"];
      const scatterKeywords = ["scatter plot", "scatter", "scatter diagram"];

      const lowerQuery = messageText.toLowerCase();
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
        { sender: "bot", text: "Error processing request. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleVoiceMessage = useCallback(async (transcript) => {
    if (!transcript.trim()) return;
    await handleUserMessage(transcript);
  }, [handleUserMessage]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceMessage(transcript);
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event);
        setIsListening(false);
      };
      recognitionRef.current = recognition;
    } else {
      console.error("Speech Recognition API not supported in this browser.");
    }
  }, [handleVoiceMessage]);

  const handleCombinedAction = async (e) => {
    e.preventDefault();
    if (isListening) {
      recognitionRef.current && recognitionRef.current.stop();
      setIsListening(false);
    } else if (userMessage.trim() !== "") {
      await handleUserMessage(userMessage);
    } else {
      recognitionRef.current && recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCombinedAction(e);
    }
  };

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
      window.location.href = "/dashboard";
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
              <p>Ask me about personal finance, historical stock data, stock comparisons, or charting your data.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender}`}
                style={{ alignSelf: message.sender === "user" ? "flex-end" : "flex-start" }}
              >
                {message.sender === "bot" ? (
                  <div
                    className="bot-message-content"
                    dangerouslySetInnerHTML={formatBotResponse(message.text)}
                  />
                ) : (
                  <p>{message.text}</p>
                )}
                <span className="message-time">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
        <div className="message-form-container">
          <input
            type="text"
            placeholder="Type a message (e.g., 'history for AAPL' or 'compare AAPL and MSFT')..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            type="button"
            className="combined-button"
            onClick={handleCombinedAction}
            disabled={loading}
          >
            {userMessage.trim() !== "" ? (
              <img src={sendIcon} alt="Send" className="icon" />
            ) : isListening ? (
              <img src={microphoneSlashIcon} alt="Stop" className="icon" />
            ) : (
              <img src={microphoneIcon} alt="Speak" className="icon" />
            )}
          </button>
        </div>
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