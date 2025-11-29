import React, { useState, useEffect } from 'react';
import { Plus, Mic, MicOff, Loader2, Sparkles, Clock, Flag, Tag, Repeat, Brain } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAI } from '../../hooks/useAI';
import { useVoice } from '../../hooks/useVoice';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

export function TaskInput() {
  const { state, dispatch } = useApp();
  const { processNaturalLanguageTask, isProcessing } = useAI();
  const { isListening, transcript, isSupported, startListening, stopListening, clearTranscript } = useVoice();

  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<'smart' | 'high' | 'medium' | 'low'>('smart');
  const [estimatedTime, setEstimatedTime] = useState<number | 'smart'>('smart');
  const [recurring, setRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Update input when voice transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isProcessing) return;

    try {
      const task = await processNaturalLanguageTask(
        text,
        priority === 'smart' ? undefined : priority,
        estimatedTime === 'smart' ? undefined : estimatedTime
      );

      // Add recurring properties if selected
      if (recurring) {
        task.recurring = true;
        task.recurringFrequency = recurringFrequency;
      }

      dispatch({ type: 'ADD_TASK', payload: task });

      // Reset state
      setInput('');
      setPriority('smart');
      setEstimatedTime('smart');
      setRecurring(false);
      setRecurringFrequency('daily');
      clearTranscript();

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

  const quickSuggestions = [
    "Email client about project update",
    "Prepare presentation for tomorrow's meeting",
    "Review and respond to urgent emails"
  ];

  return (
    <Card className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            AI Task Assistant
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Powered by intelligent AI • Just describe what you need to do
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you need to do..."
            disabled={isProcessing}
            className="pr-12 py-6 text-base"
          />

          {isSupported && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleVoiceToggle}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-200",
                isListening ? "text-red-500 hover:text-red-600 bg-red-500/10" : "text-gray-400 hover:text-teal-500"
              )}
              disabled={isProcessing}
            >
              {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </Button>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority Selector */}
          <div className="flex items-center space-x-2 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
            <Flag className={cn("w-4 h-4",
              priority === 'high' ? "text-red-500" :
                priority === 'medium' ? "text-orange-500" :
                  priority === 'low' ? "text-blue-500" : "text-purple-500"
            )} />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="bg-transparent border-none text-sm font-medium text-[var(--text-primary)] focus:ring-0 cursor-pointer outline-none"
            >
              <option value="smart">Smart Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Time Selector */}
          <div className="flex items-center space-x-2 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
            <Clock className="w-4 h-4 text-blue-500" />
            <select
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value === 'smart' ? 'smart' : Number(e.target.value))}
              className="bg-transparent border-none text-sm font-medium text-[var(--text-primary)] focus:ring-0 cursor-pointer outline-none"
            >
              <option value="smart">Smart Time</option>
              <option value="15">15 mins</option>
              <option value="30">30 mins</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          {/* Auto-tagging Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1.5">
            <Tag className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Auto-tagging
            </span>
          </div>

          {/* Recurring Toggle */}
          <div className="flex items-center space-x-2 pl-2 border-l border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setRecurring(!recurring)}
              className={cn(
                "flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium",
                recurring ? "bg-purple-500/10 text-purple-500" : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              )}
            >
              <Repeat className="w-4 h-4" />
              <span>Repeat</span>
            </button>

            {recurring && (
              <select
                value={recurringFrequency}
                onChange={(e) => setRecurringFrequency(e.target.value as any)}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-2 py-1 text-sm font-medium text-[var(--text-primary)] focus:ring-0 cursor-pointer outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
          </div>
        </div>

        {/* Quick Suggestions */}
        {!input && (
          <div className="flex flex-wrap gap-2 pt-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setInput(suggestion)}
                className="text-xs px-3 py-1.5 rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-teal-500/25"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Task
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}