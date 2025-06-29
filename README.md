# NeuroPilot AI - Productivity Assistant

A full-stack AI-powered productivity assistant built with React frontend and Node.js backend, featuring intelligent task management, chat assistance, and wellness tracking.

## 🧠 Features

- **AI Chat Assistant**: Powered by Mixtral-8x7B via OpenRouter API
- **Smart Task Management**: AI-powered task creation and prioritization
- **Email Summarization**: Intelligent email analysis and reply suggestions
- **Wellness Nudges**: Automated break reminders and health tips
- **Focus Sessions**: Time tracking and productivity monitoring
- **Dark/Light Mode**: Beautiful, responsive UI with theme switching
- **Voice Input**: Speech-to-text for hands-free interaction

## 🚀 Quick Start

### Backend Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start the Node.js backend:**
```bash
npm run backend
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. **Start the frontend development server:**
```bash
npm run dev
```

### Full Stack Development

**Run both frontend and backend simultaneously:**
```bash
npm run dev:full
```

## 🔧 API Configuration

The backend uses OpenRouter API with the following configuration:
- **Model**: `mistralai/mixtral-8x7b-instruct`
- **API Key**: Pre-configured in backend/server.js
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`

## 📡 API Endpoints

### POST /ask
Main chat endpoint for AI interactions.

**Request:**
```json
{
  "question": "What should I focus on today?"
}
```

**Response:**
```json
{
  "answer": "Based on your current tasks, I recommend...",
  "status": "success",
  "model": "mixtral-8x7b"
}
```

### GET /health
Health check endpoint for monitoring backend status.

## 🎯 Usage Examples

Try these prompts with the AI assistant:

- "What should I focus on today?"
- "Help me prioritize my tasks"
- "Suggest a productivity tip"
- "Remind me to take a break"
- "How can I improve my workflow?"
- "Create a daily plan for me"

## 🔄 Fallback System

The app includes intelligent fallback responses when:
- Backend is unavailable
- API rate limits are reached
- Network connectivity issues occur

## 🛠 Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Web Speech API for voice input

**Backend:**
- Node.js with Express
- OpenRouter API integration
- CORS middleware for frontend access
- Comprehensive error handling

## 🌟 Key Features

### Intelligent Chat
- Context-aware responses
- Productivity-focused advice
- Task and schedule integration
- Wellness recommendations

### Smart Task Management
- Natural language task creation
- AI-powered priority assignment
- Time estimation
- Automatic categorization and tagging

### Wellness Integration
- Break reminders
- Hydration tracking
- Posture checks
- Breathing exercises

### Focus Mode
- Distraction-free interface
- Time tracking
- Progress monitoring
- Session completion rewards

## 🔒 Security

- API keys are securely managed
- CORS properly configured
- Input validation on all endpoints
- Error handling with graceful fallbacks

## 📱 Responsive Design

- Mobile-first approach
- Touch-friendly interface
- Adaptive layouts
- Smooth animations and transitions

## 🎨 UI/UX Features

- **Dark/Light Mode**: Seamless theme switching
- **Animations**: Smooth transitions and micro-interactions
- **Voice Input**: Hands-free task creation and chat
- **Real-time Updates**: Live productivity scoring and progress tracking
- **Professional Design**: Clean, modern interface inspired by leading productivity apps

## 🚀 Deployment

The app is ready for deployment on platforms like:
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, Heroku

## 📊 Monitoring

- Health check endpoints
- Connection status indicators
- Error tracking and fallback systems
- Performance monitoring

---

**NeuroPilot AI** - Your intelligent productivity companion! 🧠✨