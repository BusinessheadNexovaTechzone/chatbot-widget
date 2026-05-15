import React from "react";
import "../styles/ChatHeader.css";

const ChatHeader = ({ onToggleThemePicker }) => {
  return (
    <div className="chat-header">
      <div className="header-content">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712010.png"
          alt="Nexo Bot"
          className="bot-icon"
        />
        <div className="header-titles">
          <span className="app-title">AI Assistant</span>
          <span className="header-subtitle">Tap the theme icon to change colors</span>
        </div>
      </div>
      <div className="header-info">
        <button
          type="button"
          className="theme-toggle-button"
          onClick={onToggleThemePicker}
          aria-label="Open theme picker"
        >
          <span className="theme-icon">🎨</span>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
