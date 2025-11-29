import React from 'react';
import { cn } from '../../lib/utils';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
    const isUser = role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex w-full gap-3 mb-4",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                isUser
                    ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white"
                    : "bg-[var(--bg-secondary)] border border-[var(--border-color)] text-purple-500"
            )}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div className={cn(
                "flex flex-col max-w-[80%]",
                isUser ? "items-end" : "items-start"
            )}>
                <div className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                    isUser
                        ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-tr-none"
                        : "bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none backdrop-blur-sm"
                )}>
                    {content}
                </div>

                {timestamp && (
                    <span className="text-[10px] text-[var(--text-secondary)] mt-1 px-1">
                        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
