import React, { useRef } from "react";
import "../styles/ChatInput.css";

const ChatInput = ({
  input,
  onTextChange,
  onSendMessage,
  disabled,
  onVoiceToggle,
  onToggleStreaming,
  onFileSelect,
  useStreaming,
  isRecording,
  isSpeechSupported,
  isUploading,
}) => {
  const fileInputRef = useRef(null);
  const placeholder = disabled
    ? "Waiting for response..."
    : "Type a message...";

  const handleSelectFile = (event) => {
    const file = event.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    event.target.value = "";
  };

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
          disabled={disabled || isUploading}
          title={useStreaming ? "Streaming enabled" : "Normal chat mode"}
        >
          {useStreaming ? "🚀" : "⚡"}
        </button>
        <button
          type="button"
          className="upload-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          title={isUploading ? "Uploading document..." : "Upload a document"}
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleSelectFile}
          style={{ display: "none" }}
        />
        <input
          type="text"
          className="chat-input"
          placeholder={placeholder}
          value={input}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={disabled || isUploading}
          autoFocus
        />
        <button type="submit" className="send-button" disabled={disabled || isUploading}>
          <span>📤</span>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
