import React from 'react';
import { ChatInterface } from '../components/Chat/ChatInterface';
import { ChatSidebar } from '../components/Chat/ChatSidebar';
import { useApp } from '../contexts/AppContext';

export function Chat() {
  const { state } = useApp();

  return (
    <div className="h-full flex overflow-hidden">
      <ChatSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-6 pb-0">
          <h1 className={`text-3xl font-bold mb-2 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
            AI Assistant
          </h1>
          <p className={`${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
            Chat with your AI productivity assistant
          </p>
        </div>

        <div className="flex-1 min-h-0 p-6 pt-4">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}