import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import "../styles/ChatContainer.css";

const WELCOME_MESSAGE = {
  id: "welcome",
  text: "Hi! How can I help you today?",
  sender: "bot",
  timestamp: new Date(),
  isStreaming: false,
};

const buildUrl = (baseUrl, path) => {
  const normalized = baseUrl?.toString().trim().replace(/\/$/, "") || "";
  return normalized ? `${normalized}${path}` : path;
};

const buildWsUrl = (wsBaseUrl, apiBaseUrl, sessionId) => {
  if (wsBaseUrl) {
    return buildUrl(wsBaseUrl, `/ws/web_chat/${sessionId}`);
  }

  if (apiBaseUrl) {
    return ""; // API-only mode for plugin when no wsUrl is specified.
  }

  return ""; // No default websocket by default when using local API-only mode.
};

const getMockResponse = (query, source) => {
  const text = query.toLowerCase();
  if (source === "speech") {
    return `Retrieved data for speech input: "${query}".`;
  }
  if (text.includes("hello") || text.includes("hi")) {
    return "Hello! I’m your demo chatbot. Your UI is working perfectly.";
  }
  if (text.includes("weather")) {
    return "It’s a nice day in demo mode — no backend needed to test the UI.";
  }
  if (text.includes("time")) {
    return `The current local time is ${new Date().toLocaleTimeString()}.`;
  }
  if (text.includes("help")) {
    return "This is demo mode. The UI is fully interactive even without your backend.";
  }
  return "This is a mock reply so you can test the chatbot UI while your backend is offline.";
};

function getSessionId() {
  let id = sessionStorage.getItem("nexo_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("nexo_session_id", id);
  }
  return id;
}

const ChatContainer = ({ apiBaseUrl = "", wsBaseUrl = "", mockMode = false }) => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [useRetrieveEndpoint, setUseRetrieveEndpoint] = useState(false);
  const [useStreaming, setUseStreaming] = useState(false);

  const wsRef = useRef(null);
  const sessionId = useRef(getSessionId());
  const reconnectTimer = useRef(null);
  const streamingIdRef = useRef(null);
  const recognitionRef = useRef(null);

  const effectiveMockMode = mockMode;

  const connect = useCallback(() => {
    if (effectiveMockMode) {
      setIsConnected(true);
      return;
    }

    const wsUrl = buildWsUrl(wsBaseUrl, apiBaseUrl, sessionId.current);
    console.log("[ChatContainer] connect() - wsUrl:", wsUrl, "apiBaseUrl:", apiBaseUrl);

    if (!wsUrl) {
      // API-only mode: backend can still work without WebSocket.
      setIsConnected(true);
      return;
    }

    if (apiBaseUrl) {
      setIsConnected(true);
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      clearTimeout(reconnectTimer.current);
    };

    ws.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      // Initial connect confirmation
      if (data.status === "connected") return;

      // "processing" status — no UI change needed, user msg already shown
      if (data.type === "status") return;

      if (data.type === "stream") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingIdRef.current
              ? { ...msg, text: msg.text + data.token }
              : msg
          )
        );
        return;
      }

      if (data.type === "final") {
        setIsStreaming(false);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingIdRef.current
              ? { ...msg, text: data.message, isStreaming: false }
              : msg
          )
        );
        streamingIdRef.current = null;
        return;
      }

      if (data.type === "cancelled" || data.type === "error") {
        setIsStreaming(false);
        const errText =
          data.type === "error"
            ? "Something went wrong. Please try again."
            : data.message || "";
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingIdRef.current
              ? { ...msg, text: errText, isStreaming: false }
              : msg
          )
        );
        streamingIdRef.current = null;
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // If stream was in progress, mark it as interrupted
      if (streamingIdRef.current) {
        setIsStreaming(false);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingIdRef.current
              ? {
                  ...msg,
                  text: msg.text || "Connection lost. Please try again.",
                  isStreaming: false,
                }
              : msg
          )
        );
        streamingIdRef.current = null;
      }

      if (apiBaseUrl) {
        setIsConnected(true);
      } else if (effectiveMockMode) {
        setIsConnected(true);
      } else {
        reconnectTimer.current = setTimeout(connect, 3000);
      }
    };

    ws.onerror = () => ws.close();

    wsRef.current = ws;
  }, [apiBaseUrl, mockMode, wsBaseUrl, effectiveMockMode]);

  useEffect(() => {
    const recognitionCtor =
      typeof window !== "undefined" &&
      (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition);

    setSpeechSupported(
      Boolean(
        recognitionCtor &&
          typeof navigator !== "undefined" &&
          navigator.mediaDevices &&
          typeof navigator.mediaDevices.getUserMedia === "function"
      )
    );

    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const handleInputChange = (value) => {
    setInput(value);
    setUseRetrieveEndpoint(false);
  };

  const handleStreamingToggle = () => {
    setUseStreaming((prev) => !prev);
  };

  const handleVoiceToggle = () => {
    if (!speechSupported) return;
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setInput(transcript.trim());
      setUseRetrieveEndpoint(true);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;

    const startRecognition = () => {
      try {
        recognition.start();
      } catch (err) {
        console.warn("Speech recognition start failed:", err);
        setIsRecording(false);
      }
    };

    if (
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function"
    ) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => startRecognition())
        .catch((error) => {
          console.warn("Microphone permission denied or unavailable:", error);
          setSpeechSupported(false);
        });
    } else {
      startRecognition();
    }
  };

 const handleSendMessage = async (e) => {
  e.preventDefault();
  const text = input.trim();
  if (!text || isStreaming) return;

  const userMsg = {
    id: crypto.randomUUID(),
    text,
    sender: "user",
    timestamp: new Date(),
    metadata: useRetrieveEndpoint ? { source: "speech" } : undefined,
  };

  const botMsgId = crypto.randomUUID();
  streamingIdRef.current = botMsgId;

  const botMsg = {
    id: botMsgId,
    text: "",
    sender: "bot",
    timestamp: new Date(),
    isStreaming: true,
  };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setIsStreaming(true);
    setInput("");

    const isStreamingEndpoint = useStreaming && !useRetrieveEndpoint;
    const endpoint = isStreamingEndpoint
      ? "/api/v1/chat/stream"
      : useRetrieveEndpoint
      ? "/api/v1/retrieve?use_query_rewrite=true&use_bm25=true&use_reranking=true&hybrid_weight=0.5"
      : "/api/v1/chat";
    const apiUrl = buildUrl(apiBaseUrl, endpoint);
    const streamValue = isStreamingEndpoint;
    const requestBody = {
      query: text,
      language: useRetrieveEndpoint ? "tamil" : undefined,
      session_id: sessionId.current,
      stream: streamValue,
      source: useRetrieveEndpoint ? "speech" : undefined,
    };

    try {
      if (mockMode || effectiveMockMode) {
        const answer = getMockResponse(text, useRetrieveEndpoint ? "speech" : undefined);
        const delay = 600 + Math.floor(Math.random() * 800);

        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId
                ? { ...msg, text: answer, isStreaming: false }
                : msg
            )
          );
          setIsStreaming(false);
        }, delay);
        return;
      }

      console.log("[ChatContainer] Request", {
        endpoint: apiUrl,
        route: endpoint,
        stream: streamValue,
        session_id: sessionId.current,
      });

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("[ChatContainer] Request failed", {
          endpoint: apiUrl,
          status: response.status,
          body: errorBody,
        });
        throw new Error(errorBody || "Chat request failed");
      }

      if (isStreamingEndpoint) {
        console.log("[ChatContainer] Streaming response started", { endpoint: apiUrl });
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Streaming response reader unavailable");
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let finished = false;

        while (!finished) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop();

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;

            let payload = line;
            if (payload.startsWith("data:")) {
              payload = payload.slice(5).trim();
            }
            if (!payload) continue;
            if (payload === "[DONE]") {
              finished = true;
              break;
            }

            let chunk = "";
            try {
              const parsed = JSON.parse(payload);
              if (parsed.type === "stream" && parsed.token) {
                chunk = parsed.token;
              } else if (parsed.type === "final" && parsed.message) {
                chunk = parsed.message;
                  finished = true;
                chunk = payload;
              }
            } catch {
              chunk = payload;
            }

            if (chunk) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMsgId
                    ? { ...msg, text: msg.text + chunk }
                    : msg
                )
              );
            }
          }
        }

        if (buffer.trim()) {
          let trailing = buffer.trim();
          if (trailing.startsWith("data:")) {
            trailing = trailing.slice(5).trim();
          }
          if (trailing && trailing !== "[DONE]") {
            try {
              const parsed = JSON.parse(trailing);
              const trailingChunk =
                parsed.message || parsed.token || parsed.text || trailing;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMsgId
                    ? { ...msg, text: msg.text + trailingChunk }
                    : msg
                )
              );
            } catch {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMsgId
                    ? { ...msg, text: msg.text + trailing }
                    : msg
                )
              );
            }
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
          )
        );
        streamingIdRef.current = null;
        setIsStreaming(false);
        console.log("[ChatContainer] Streaming response finished", { endpoint: apiUrl });
        return;
      }

      const data = await response.json();
      console.log("[ChatContainer] Response from", apiUrl, "status:", response.status, "body:", data);
      const answer = data?.answer ?? data?.detailed_answer ?? data?.short_answer ?? data?.message;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? { ...msg, text: answer, isStreaming: false }
            : msg
        )
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? { ...msg, text: "Something went wrong. Please try again.", isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };
  return (
    <div className="chat-container">
      <ChatHeader isConnected={isConnected} />
      <ChatMessages messages={messages} />
      <ChatInput
        input={input}
        onTextChange={handleInputChange}
        onSendMessage={handleSendMessage}
        disabled={isStreaming}
        onVoiceToggle={handleVoiceToggle}
        onToggleStreaming={handleStreamingToggle}
        useStreaming={useStreaming}
        isRecording={isRecording}
        isSpeechSupported={speechSupported}
      />
    </div>
  );
};

export default ChatContainer;
