import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAI } from '../../hooks/useAI';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { ChatMessage } from './ChatMessage';
import { ChatSuggestions } from './ChatSuggestions';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ChatInterface() {
  const { state } = useApp();
  const { generateChatResponse, isProcessing } = useAI();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string, timestamp: Date }[]>([
    { role: 'assistant', content: "Hello! I'm NeuroPilot. How can I help you be more productive today?", timestamp: new Date() }
  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);

    try {
      // Simulate AI response for now (or use actual hook if connected)
      // const response = await generateChatResponse(userMessage);

      // Mock response for UI testing
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I can help you with "${userMessage}". I'm currently in demo mode, but fully functional AI integration is coming soon!`,
          timestamp: new Date()
        }]);
      }, 1000);

    } catch (error) {
      console.error("Chat error:", error);
    }
  };

  const handleSuggestionSelect = (prompt: string) => {
    setInput(prompt);
    // Optional: auto-focus input
  };

  return (
    <Card className={cn(
      "flex flex-col overflow-hidden transition-all duration-300 ease-in-out border-[var(--border-color)] shadow-xl bg-[var(--bg-secondary)]/80 backdrop-blur-xl",
      isExpanded ? "fixed bottom-6 right-6 w-[400px] h-[600px] z-[100]" : "h-[500px] w-full relative z-0"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">NeuroPilot AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-[var(--text-secondary)]">Online</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[var(--text-secondary)]"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-primary)]/30">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] ml-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[var(--bg-secondary)]/50 backdrop-blur-md border-t border-[var(--border-color)] space-y-3">
        <ChatSuggestions onSelect={handleSuggestionSelect} />

        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="pr-10 bg-[var(--bg-primary)] border-[var(--border-color)] focus:ring-teal-500/20"
            disabled={isProcessing}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isProcessing}
            className="absolute right-1 w-8 h-8 bg-teal-500 hover:bg-teal-600 text-white shadow-none"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </Card>
  );
}