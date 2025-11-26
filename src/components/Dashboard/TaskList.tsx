import React from 'react';
import { Clock, Flag, Tag, Check, Trash2, Sparkles } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Task } from '../../types';

export function TaskList() {
  const { state, dispatch } = useApp();

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': 
        return state.theme === 'dark' 
          ? 'text-red-400 bg-red-900/20 border-red-800' 
          : 'text-red-700 bg-red-50 border-red-200';
      case 'medium': 
        return state.theme === 'dark' 
          ? 'text-orange-400 bg-orange-900/20 border-orange-800' 
          : 'text-orange-700 bg-orange-50 border-orange-200';
      case 'low': 
        return state.theme === 'dark' 
          ? 'text-green-400 bg-green-900/20 border-green-800' 
          : 'text-green-700 bg-green-50 border-green-200';
      default: 
        return state.theme === 'dark' 
          ? 'text-gray-400 bg-gray-800 border-gray-700' 
          : 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getTagColor = (tag: string, isSelected: boolean) => {
    if (isSelected) {
      return state.theme === 'dark' 
        ? 'bg-purple-600 text-white border-purple-500' 
        : 'bg-purple-600 text-white border-purple-600';
    }
    return state.theme === 'dark' 
      ? 'bg-blue-900/30 text-blue-300 border-blue-800 hover:bg-blue-800/50' 
      : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
  };

  // Filter tasks based on selected tags
  const filteredTasks = state.selectedTags.length > 0
    ? state.tasks.filter(task => 
        task.tags?.some(tag => state.selectedTags.includes(tag))
      )
    : state.tasks;

  const activeTasks = filteredTasks.filter(task => task.status !== 'completed');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  // Get all unique tags
  const allTags = Array.from(new Set(state.tasks.flatMap(task => task.tags || [])));

  return (
    <div className={`${
      state.theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } rounded-2xl border shadow-md p-6 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${
          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Today's Tasks
        </h2>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${
            state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {activeTasks.length} active, {completedTasks.length} completed
          </span>
        </div>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                  getTagColor(tag, state.selectedTags.includes(tag))
                }`}
              >
                <Tag className="w-3 h-3 mr-1" />
                #{tag}
              </button>
            ))}
            {state.selectedTags.length > 0 && (
              <button
                onClick={() => dispatch({ type: 'SET_SELECTED_TAGS', payload: [] })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                  state.theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Active Tasks */}
        {activeTasks.map((task, index) => (
          <div
            key={task.id}
            className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
              state.theme === 'dark'
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-650'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
            style={{
              animation: `slideInLeft 0.4s ease-out ${index * 0.1}s both`
            }}
          >
            <div className="flex items-start space-x-4">
              <button
                onClick={() => handleToggleTask(task)}
                className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  task.status === 'completed'
                    ? 'bg-green-500 border-green-500'
                    : state.theme === 'dark'
                      ? 'border-gray-500 hover:border-green-400'
                      : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {task.status === 'completed' && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <h3 className={`font-semibold break-words ${
                      task.status === 'completed'
                        ? state.theme === 'dark' ? 'text-gray-500 line-through' : 'text-gray-500 line-through'
                        : state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    {task.isAIGenerated && (
                      <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" title="AI Generated" />
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className={`p-1 rounded-md transition-colors duration-200 flex-shrink-0 ${
                      state.theme === 'dark'
                        ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/20'
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {task.description && (
                  <p className={`text-sm mb-3 break-words ${
                    state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center space-x-3 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getPriorityColor(task.priority)}`}>
                      <Flag className="w-3 h-3 mr-1" />
                      {task.priority}
                    </span>
                    
                    {task.estimatedTime && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                        state.theme === 'dark' 
                          ? 'bg-gray-600 text-gray-300 border-gray-500' 
                          : 'bg-gray-200 text-gray-700 border-gray-300'
                      }`}>
                        <Clock className="w-3 h-3 mr-1" />
                        {task.estimatedTime}m
                      </span>
                    )}
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex items-center space-x-1 flex-wrap">
                      {task.tags.slice(0, 3).map((tag, tagIndex) => (
                        <button
                          key={tagIndex}
                          onClick={() => handleTagClick(tag)}
                          className={`text-xs px-2 py-1 rounded-full border transition-colors duration-200 whitespace-nowrap ${
                            getTagColor(tag, state.selectedTags.includes(tag))
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                      {task.tags.length > 3 && (
                        <span className={`text-xs whitespace-nowrap ${
                          state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          +{task.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mt-6">
            <h3 className={`text-sm font-semibold mb-3 ${
              state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Completed ({completedTasks.length})
            </h3>
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-xl mb-2 border ${
                  state.theme === 'dark' ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleTask(task)}
                    className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm line-through ${
                      state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {task.title}
                    </span>
                    {task.isAIGenerated && (
                      <Sparkles className="w-3 h-3 text-purple-400 opacity-60" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTasks.length === 0 && (
          <div className={`text-center py-8 ${
            state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {state.selectedTags.length > 0 ? (
              <p>No tasks found with selected tags</p>
            ) : (
              <p>No tasks yet. Add your first task using the AI assistant!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}