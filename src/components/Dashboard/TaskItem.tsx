import React from 'react';
import { Clock, Flag, Tag, Check, Trash2, Sparkles, Repeat, MoreVertical } from 'lucide-react';
import { Task } from '../../types';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface TaskItemProps {
    task: Task;
    onToggle: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onTagClick: (tag: string) => void;
    index: number;
}

export function TaskItem({ task, onToggle, onDelete, onTagClick, index }: TaskItemProps) {
    const isCompleted = task.status === 'completed';

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            default: return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={cn(
                "group relative p-4 rounded-xl border transition-all duration-200",
                isCompleted
                    ? "bg-[var(--bg-secondary)]/50 border-[var(--border-color)] opacity-60"
                    : "bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/5"
            )}
        >
            <div className="flex items-start gap-4">
                {/* Custom Checkbox */}
                <button
                    onClick={() => onToggle(task)}
                    className={cn(
                        "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                        isCompleted
                            ? "bg-teal-500 border-teal-500 scale-100"
                            : "border-[var(--text-secondary)] hover:border-teal-500 hover:scale-110"
                    )}
                >
                    <motion.div
                        initial={false}
                        animate={{ scale: isCompleted ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    </motion.div>
                </button>

                <div className="flex-1 min-w-0 space-y-2">
                    {/* Title & Actions */}
                    <div className="flex items-start justify-between gap-2">
                        <h3 className={cn(
                            "font-medium text-base leading-tight transition-all duration-200",
                            isCompleted ? "text-[var(--text-secondary)] line-through decoration-2 decoration-teal-500/30" : "text-[var(--text-primary)]"
                        )}>
                            {task.title}
                        </h3>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10"
                                onClick={() => onDelete(task.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Description */}
                    {task.description && (
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        {/* Priority Badge */}
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border", getPriorityColor(task.priority))}>
                            <Flag className="w-3 h-3 mr-1" />
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>

                        {/* Time Badge */}
                        {task.estimatedTime && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                                <Clock className="w-3 h-3 mr-1" />
                                {task.estimatedTime}m
                            </span>
                        )}

                        {/* Recurring Badge */}
                        {task.recurring && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
                                <Repeat className="w-3 h-3 mr-1" />
                                {task.recurringFrequency}
                            </span>
                        )}

                        {/* AI Badge */}
                        {task.isAIGenerated && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r from-teal-500/10 to-cyan-500/10 text-teal-600 border border-teal-500/20">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI
                            </span>
                        )}

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                            <div className="flex items-center gap-1 ml-auto">
                                {task.tags.slice(0, 2).map((tag, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onTagClick(tag)}
                                        className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-teal-500 hover:bg-teal-500/5 transition-colors"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
