import React from "react";
import "../styles/ChatInput.css";

const ChatInput = ({
  input,
  onTextChange,
  onSendMessage,
  disabled,
  onVoiceToggle,
  onToggleStreaming,
  useStreaming,
  isRecording,
  isSpeechSupported,
}) => {
  const placeholder = disabled
    ? "Waiting for response..."
    : "Type a message...";

  return (
    <form className="chat-input-wrapper" onSubmit={onSendMessage}>
      <div className="chat-input-row">
        <button
          type="button"
          className={`voice-button ${isRecording ? "recording" : ""}`}
          onClick={onVoiceToggle}
          disabled={disabled || !isSpeechSupported}
          title={
            isSpeechSupported
              ? isRecording
                ? "Stop voice input"
                : "Start voice input"
              : "Speech input not supported"
          }
        >
          {isRecording ? "⏹️" : "🎙️"}
        </button>
        <button
          type="button"
          className={`stream-toggle-button ${useStreaming ? "active" : ""}`}
          onClick={onToggleStreaming}
          disabled={disabled}
          title={useStreaming ? "Streaming enabled" : "Normal chat mode"}
        >
          {useStreaming ? "🚀" : "⚡"}
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder={placeholder}
          value={input}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={disabled}
          autoFocus
        />
        <button type="submit" className="send-button" disabled={disabled}>
          <span>📤</span>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
