import React from "react";
import "../styles/MessageBubble.css";

const MessageBubble = ({ message }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isTyping = message.isStreaming && message.text === "";

  return (
    <div className={`message-wrapper ${message.sender}`}>
      <div className={`message-bubble ${message.sender}`}>
        {isTyping ? (
          <div className="typing-indicator">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <p className="message-text">
            {message.text}
            {message.isStreaming && <span className="streaming-cursor" />}
          </p>
        )}
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
