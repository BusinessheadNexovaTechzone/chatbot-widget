import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import ChatContainer from "./components/ChatContainer";
import "./styles/widget.css";

const ChatWidget = ({ config }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div className="chatbot-widget-shell">
      {!isOpen && (
        <button className="chatbot-toggle-button" onClick={toggleOpen}>
          Chat
        </button>
      )}

      {isOpen && (
        <div className="chatbot-widget-panel">
          <button className="chatbot-close-button" onClick={toggleOpen}>
            ×
          </button>
          <ChatContainer
            apiBaseUrl={config.apiUrl || ""}
            wsBaseUrl={config.wsUrl || ""}
            mockMode={config.mock === true}
          />
        </div>
      )}
    </div>
  );
};

const createChatWidget = (config = {}) => {
  const mountId = config.targetId || "chatbot-root";
  let container = document.getElementById(mountId);

  if (!container) {
    container = document.createElement("div");
    container.id = mountId;
    document.body.appendChild(container);
  }

  if (container.__chatbotRoot) {
    return container.__chatbotRoot;
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ChatWidget config={config} />
    </React.StrictMode>
  );

  container.__chatbotRoot = root;
  return root;
};

const destroyChatWidget = (targetId = "chatbot-root") => {
  const container = document.getElementById(targetId);
  if (container?.__chatbotRoot) {
    container.__chatbotRoot.unmount();
    container.remove();
  }
};

const ChatBot = {
  init: createChatWidget,
  destroy: destroyChatWidget,
};

if (typeof window !== "undefined") {
  window.ChatBot = window.ChatBot || ChatBot;
}

export default ChatBot;
