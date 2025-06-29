import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, User, Loader2, Sparkles, Brain, Zap, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAI } from '../../hooks/useAI';
import { useVoice } from '../../hooks/useVoice';

export function ChatInterface() {
  const { state, dispatch } = useApp();
  const { generateChatResponse, isProcessing } = useAI();
  const { isListening, transcript, isSupported, startListening, stopListening, clearTranscript } = useVoice();
  const [input, setInput] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages]);

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: 'test connection'
        })
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim() || transcript.trim();
    if (!text || isProcessing) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: text,
      timestamp: new Date()
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });

    setInput('');
    clearTranscript();

    try {
      // Get AI response with enhanced context
      const context = {
        tasks: state.tasks,
        productivityScore: state.productivityScore,
        mode: state.mode,
        focusSession: state.focusSession,
        completedTasksToday: state.tasks.filter(t => t.status === 'completed').length,
        pendingTasks: state.tasks.filter(t => t.status === 'pending').length,
        highPriorityTasks: state.tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length
      };
      
      const response = await generateChatResponse(text, context);
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant' as const,
        content: response,
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: assistantMessage });
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant' as const,
        content: 'I apologize, but I encountered an issue. Let me help you with your productivity needs in another way. What would you like to focus on?',
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: errorMessage });
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const displayText = input || transcript;

  const quickPrompts = [
    "What should I focus on today?",
    "Summarize my current tasks",
    "Suggest a productivity tip",
    "How's my progress looking?",
    "Remind me to take a break",
    "Help me prioritize my work"
  ];

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400';
      case 'disconnected': return 'text-orange-400';
      case 'checking': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'FastAPI Backend Connected';
      case 'disconnected': return 'Using Fallback Mode';
      case 'checking': return 'Checking Connection...';
      default: return 'Unknown Status';
    }
  };

  return (
    <div className={`h-full flex flex-col ${
      state.theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } rounded-2xl border shadow-lg transition-all duration-300`}>
      {/* Enhanced Header */}
      <div className={`p-6 border-b ${
        state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                NeuroPilot AI
              </h2>
              <p className={`text-sm ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Powered by Mixtral-8x7B via OpenRouter
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                connectionStatus === 'disconnected' ? 'bg-orange-500' : 'bg-blue-500 animate-pulse'
              }`} />
              <span className={`text-xs font-medium ${getConnectionStatusColor()}`}>
                {connectionStatus === 'connected' ? 'Online' : 
                 connectionStatus === 'disconnected' ? 'Offline' : 'Connecting'}
              </span>
            </div>
            <span className={`text-xs ${
              state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              {getConnectionStatusText()}
            </span>
          </div>
        </div>

        {/* Connection Status Banner */}
        {connectionStatus === 'disconnected' && (
          <div className={`mt-4 p-3 rounded-lg border ${
            state.theme === 'dark' 
              ? 'bg-orange-900/20 border-orange-800 text-orange-300' 
              : 'bg-orange-50 border-orange-200 text-orange-700'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                FastAPI backend unavailable - Using intelligent fallback responses
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {state.chatMessages.map((message, index) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
            style={{
              animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
            }}
          >
            {message.type === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
              message.type === 'user'
                ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white'
                : state.theme === 'dark'
                  ? 'bg-gray-700 text-gray-100 border border-gray-600'
                  : 'bg-gray-100 text-gray-900 border border-gray-200'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-2 opacity-70`}>
                {formatTime(message.timestamp)}
              </p>
            </div>

            {message.type === 'user' && (
              <div className={`w-8 h-8 ${
                state.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
              } rounded-full flex items-center justify-center shadow-md`}>
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className={`px-4 py-3 rounded-2xl border shadow-md ${
              state.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
            }`}>
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className={`text-sm ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {connectionStatus === 'connected' ? 'Mixtral is thinking...' : 'Analyzing and thinking...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {state.chatMessages.length <= 1 && (
        <div className={`px-6 py-3 border-t ${
          state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <p className={`text-xs font-medium mb-2 ${
            state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            💡 Try asking:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.slice(0, 3).map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInput(prompt)}
                className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 hover:scale-105 ${
                  state.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className={`p-6 border-t ${
        state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        {isListening && (
          <div className="flex items-center space-x-2 px-4 py-2 mb-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className={`text-sm font-medium ${
              state.theme === 'dark' ? 'text-red-300' : 'text-red-700'
            }`}>
              🎤 Listening... Speak now
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={displayText}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about productivity, tasks, or wellness..."
              className={`w-full p-3 rounded-xl border-2 resize-none transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                state.theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              rows={1}
              disabled={isProcessing}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>

          {isSupported && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-3 rounded-xl transition-all duration-200 shadow-md ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : state.theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isProcessing}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <button
            type="submit"
            disabled={!displayText.trim() || isProcessing}
            className={`p-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white rounded-xl transition-all duration-200 shadow-lg ${
              !displayText.trim() || isProcessing
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-xl hover:scale-105 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Backend Status Footer */}
        <div className={`mt-3 pt-3 border-t ${
          state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className={`w-3 h-3 ${getConnectionStatusColor()}`} />
              <span className={`text-xs ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {connectionStatus === 'connected' ? 'Powered by Mixtral-8x7B' : 'Intelligent Fallback Active'}
              </span>
            </div>
            <button
              onClick={checkBackendConnection}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                state.theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Refresh Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}