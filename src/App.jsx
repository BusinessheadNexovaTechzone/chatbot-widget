import ChatContainer from "./components/ChatContainer";
import "./styles/index.css";

const API_BASE_URL = "http://chatbot-ai-v01-fdcnezc3ach9gceu.centralindia-01.azurewebsites.net";

function App() {
  return <ChatContainer apiBaseUrl={API_BASE_URL} />;
}

export default App;
