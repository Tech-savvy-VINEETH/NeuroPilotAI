import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Mail, CheckSquare } from 'lucide-react';

interface ChatSuggestionsProps {
    onSelect: (suggestion: string) => void;
}

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
    const suggestions = [
        { icon: CheckSquare, label: "Create a task", prompt: "Create a task to " },
        { icon: Calendar, label: "Schedule meeting", prompt: "Schedule a meeting with " },
        { icon: Mail, label: "Draft email", prompt: "Draft an email to " },
        { icon: Sparkles, label: "Brainstorm ideas", prompt: "Brainstorm ideas for " },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((item, index) => (
                <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onSelect(item.prompt)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-teal-500/50 hover:bg-teal-500/5 transition-all whitespace-nowrap"
                >
                    <item.icon className="w-3 h-3" />
                    {item.label}
                </motion.button>
            ))}
        </div>
    );
}
