import React from "react";
import "../styles/ChatHeader.css";

const ChatHeader = ({ isConnected }) => {
  return (
    <div className="chat-header">
      <div className="header-content">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712010.png"
          alt="Nexo Bot"
          className="bot-icon"
        />
        <div className="header-titles">
          <h1 className="app-title">Nexo</h1>
          <span className="header-subtitle">AI Assistant</span>
        </div>
      </div>
      <div className="header-info">
        <span className={`status ${isConnected ? "online" : "offline"}`}>
          {isConnected ? "Online" : "Connecting..."}
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
