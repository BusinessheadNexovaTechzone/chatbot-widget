# AI-Chatbot Application

A clean, modern WhatsApp-style chatbot application built with React and Vite.

## 🎯 Features

- **Mobile-First Design**: Responsive WhatsApp-like interface
- **Clean & Neat UI**: Modern, professional look with smooth animations
- **Real-time Messaging**: Send and receive messages with timestamps
- **Two Message Colors**: 
  - User messages: Light green background (#dcf8c6)
  - Bot responses: Light gray background (#e3e3e3)
- **Auto-scrolling**: Messages automatically scroll to the latest
- **Responsive Design**: Works perfectly on mobile and desktop

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ChatContainer.jsx    # Main container
│   ├── ChatHeader.jsx       # Header with app name & icon
│   ├── ChatMessages.jsx     # Message history display
│   ├── MessageBubble.jsx    # Individual message component
│   └── ChatInput.jsx        # Input field & send button
├── pages/              # Page components
├── styles/             # CSS files
│   ├── index.css
│   ├── ChatContainer.css
│   ├── ChatHeader.css
│   ├── ChatMessages.css
│   ├── MessageBubble.css
│   └── ChatInput.css
├── assets/             # Images and static files
├── App.jsx            # Main app component
└── main.jsx           # React entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start backend API server
npm run server

# Start frontend development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

The application will open automatically at `http://localhost:3000`

## 🌐 Widget / Plugin Mode

This project now supports building a standalone chatbot widget that can be embedded on any website.

### Build the widget

```bash
npm run build
```

That produces a standalone script in `dist/`, for example `dist/chatbot.iife.js`.

### Use it on any website

```html
<script>
  window.ChatBotConfig = {
    apiUrl: "https://api.yoursite.com",
    wsUrl: "wss://api.yoursite.com",
    targetId: "chatbot-root"
  };
</script>
<script src="https://yourcdn.com/chatbot.iife.js"></script>
<script>
  ChatBot.init(window.ChatBotConfig);
</script>
```

### Demo / UI-only test mode

If your backend is not ready yet, use the mock mode to test the widget UI immediately:

```html
<script>
  window.ChatBotConfig = {
    mock: true,
    targetId: "chatbot-root"
  };
</script>
<script src="https://yourcdn.com/chatbot.iife.js"></script>
<script>
  ChatBot.init(window.ChatBotConfig);
</script>
```

In mock mode, the widget will:
- immediately show UI as connected
- accept typed messages
- return demo responses without calling any backend

### Notes
- `apiUrl` should point to your backend API host
- `wsUrl` should point to your WebSocket host if you use live streaming
- `targetId` is optional; otherwise the widget appends to `document.body`

## 🎨 Color Scheme

- **Primary Color**: #075e54 (Dark Teal)
- **Secondary Color**: #25d366 (WhatsApp Green)
- **User Message**: #dcf8c6 (Light Green)
- **Bot Message**: #e3e3e3 (Light Gray)
- **Background**: Gradient (Purple to Pink)

## 💻 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📱 Mobile Optimization

The app is fully optimized for mobile devices with:
- Touch-friendly buttons
- Responsive font sizes
- Proper spacing for mobile interaction
- Full-screen mode on mobile devices

## ✨ Customization

### Change Bot Name
Edit [src/components/ChatHeader.jsx](src/components/ChatHeader.jsx): Update the `app-title` text

### Change Colors
Edit [src/styles/index.css](src/styles/index.css): Modify the CSS variables in `:root`

### Change Bot Icon
Edit [src/components/ChatHeader.jsx](src/components/ChatHeader.jsx): Update the image src URL

### Add Actual AI Integration
Edit [src/components/ChatContainer.jsx](src/components/ChatContainer.jsx): Replace the mock bot response with API calls

## 📦 Technologies Used

- **React**: 18.2.0
- **Vite**: 5.0.0
- **CSS3**: Modern styling with gradients and animations
- **JavaScript**: ES6+

## 🔧 Development Tips

1. **Add new messages**: Use the message input at the bottom
2. **Customize styling**: All CSS files are in `/src/styles/`
3. **Add features**: Create new components in `/src/components/`
4. **Connect API**: Replace mock responses in `ChatContainer.jsx`

## 📄 License

MIT License - feel free to use for personal and commercial projects

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

---

**Built with ❤️ using React + Vite**
