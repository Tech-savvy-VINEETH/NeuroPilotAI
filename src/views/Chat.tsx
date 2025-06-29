import React from 'react';
import { ChatInterface } from '../components/Chat/ChatInterface';
import { useApp } from '../contexts/AppContext';

export function Chat() {
  const { state } = useApp();

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${
          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          AI Assistant
        </h1>
        <p className={`${
          state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Chat with your AI productivity assistant
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}