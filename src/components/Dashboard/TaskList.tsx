import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Task } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { TaskItem } from './TaskItem';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export function TaskList() {
  const { state, dispatch } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleToggleTask = (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    dispatch({
      type: 'UPDATE_TASK',
      payload: { id: task.id, updates: { status: newStatus } }
    });
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const handleTagClick = (tag: string) => {
    const newSelectedTags = state.selectedTags.includes(tag)
      ? state.selectedTags.filter(t => t !== tag)
      : [...state.selectedTags, tag];
    dispatch({ type: 'SET_SELECTED_TAGS', payload: newSelectedTags });
  };

  // Filter tasks based on selected tags and active filter tab
  const filteredTasks = state.tasks.filter(task => {
    const matchesTags = state.selectedTags.length === 0 || task.tags?.some(tag => state.selectedTags.includes(tag));
    const matchesFilter =
      filter === 'all' ? true :
        filter === 'pending' ? task.status !== 'completed' :
          task.status === 'completed';

    return matchesTags && matchesFilter;
  }).sort((a, b) => {
    // Sort pending tasks first, then by date
    if (a.status !== b.status) return a.status === 'completed' ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const activeCount = state.tasks.filter(t => t.status !== 'completed').length;
  const completedCount = state.tasks.filter(t => t.status === 'completed').length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl">Today's Tasks</CardTitle>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span className="font-medium text-teal-500">{activeCount}</span> active
            <span className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
            <span className="font-medium text-purple-500">{completedCount}</span> done
          </div>
        </div>

        {/* Segmented Control */}
        <div className="flex p-1 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
          {(['all', 'pending', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "relative flex-1 py-1.5 text-sm font-medium rounded-md transition-colors z-10 capitalize",
                filter === tab ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {filter === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[var(--bg-secondary)] rounded-md shadow-sm border border-[var(--border-color)] -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>

        {/* Active Tags */}
        <AnimatePresence>
          {state.selectedTags.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-2 pt-3 overflow-hidden"
            >
              {state.selectedTags.map(tag => (
                <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-teal-500/10 text-teal-500 border border-teal-500/20">
                  #{tag}
                  <button onClick={() => handleTagClick(tag)} className="ml-1 hover:text-teal-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => dispatch({ type: 'SET_SELECTED_TAGS', payload: [] })}
                className="text-xs text-[var(--text-secondary)] hover:text-red-500 underline decoration-dotted"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onTagClick={handleTagClick}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-40 text-center text-[var(--text-secondary)]"
            >
              <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-3">
                <Tag className="w-6 h-6 opacity-50" />
              </div>
              <p>No tasks found</p>
              {filter !== 'all' && (
                <button onClick={() => setFilter('all')} className="text-sm text-teal-500 hover:underline mt-1">
                  View all tasks
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}