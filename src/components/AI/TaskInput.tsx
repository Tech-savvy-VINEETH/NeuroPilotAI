import React, { useState } from 'react';
import { Plus, Mic, MicOff, Loader2, Send, Sparkles, Clock, Flag, Tag, Brain } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAI } from '../../hooks/useAI';
import { useVoice } from '../../hooks/useVoice';

export function TaskInput() {
  const { state, dispatch } = useApp();
  const { processNaturalLanguageTask, isProcessing } = useAI();
  const { isListening, transcript, isSupported, startListening, stopListening, clearTranscript } = useVoice();
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim() || transcript.trim();
    if (!text || isProcessing) return;

    try {
      const task = await processNaturalLanguageTask(text);
      dispatch({ type: 'ADD_TASK', payload: task });
      setInput('');
      clearTranscript();
      
      // Show success animation
      const successMessage = `✨ Task created: "${task.title}" (${task.priority} priority, ~${task.estimatedTime}m)`;
      console.log(successMessage);
    } catch (error) {
      console.error('Error processing task:', error);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const displayText = input || transcript;

  const quickSuggestions = [
    "Email client about project update",
    "Prepare presentation for tomorrow's meeting", 
    "Review and respond to urgent emails",
    "Schedule team standup for next week",
    "Research competitors for market analysis"
  ];

  return (
    <div className={`${
      state.theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } rounded-2xl border shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            AI Task Assistant
          </h2>
          <p className={`text-sm ${
            state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Powered by intelligent AI • Just describe what you need to do
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={displayText}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you need to do (e.g., 'prepare pitch deck for investors', 'email Sarah about project deadline', 'schedule team meeting')"
            className={`w-full p-4 pr-12 rounded-xl border-2 resize-none transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
              state.theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            rows={3}
            disabled={isProcessing}
          />
          
          {isSupported && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`absolute right-3 top-3 p-2 rounded-lg transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-lg'
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
        </div>

        {isListening && (
          <div className="flex items-center space-x-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className={`text-sm font-medium ${
              state.theme === 'dark' ? 'text-red-300' : 'text-red-700'
            }`}>
              🎤 Listening... Speak clearly
            </span>
          </div>
        )}

        {/* Quick Suggestions */}
        {!displayText && (
          <div className="space-y-2">
            <p className={`text-xs font-medium ${
              state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              💡 Quick suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setInput(suggestion)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 hover:scale-105 ${
                    state.theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Flag className={`w-4 h-4 ${
                state.theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <span className={`text-sm font-medium ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Smart priority
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className={`w-4 h-4 ${
                state.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className={`text-sm font-medium ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Time estimation
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className={`w-4 h-4 ${
                state.theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`} />
              <span className={`text-sm font-medium ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Auto-tagging
              </span>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!displayText.trim() || isProcessing}
            className={`px-6 py-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg ${
              !displayText.trim() || isProcessing
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-xl hover:scale-105 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Create Task</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* AI Status Indicator */}
      <div className={`mt-4 pt-4 border-t ${
        state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className={`text-xs ${
              state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              AI Assistant Active
            </span>
          </div>
          <span className={`text-xs ${
            state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {state.tasks.filter(t => t.isAIGenerated).length} AI-generated tasks
          </span>
        </div>
      </div>
    </div>
  );
}