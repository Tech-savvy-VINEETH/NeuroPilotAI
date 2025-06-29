import React from 'react';
import { TaskList } from '../components/Dashboard/TaskList';
import { TaskInput } from '../components/AI/TaskInput';
import { useApp } from '../contexts/AppContext';

export function Tasks() {
  const { state } = useApp();

  return (
    <div className="space-y-8 h-full">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${
          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Task Management
        </h1>
        <p className={`${
          state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Manage your tasks with AI-powered assistance
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          <TaskInput />
          
          {/* Task Statistics */}
          <div className={`${
            state.theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } rounded-2xl border shadow-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Task Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className={`text-2xl font-bold ${
                  state.theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  {state.tasks.filter(t => t.status === 'completed').length}
                </p>
                <p className={`text-sm ${
                  state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Completed
                </p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${
                  state.theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                }`}>
                  {state.tasks.filter(t => t.status === 'pending').length}
                </p>
                <p className={`text-sm ${
                  state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Pending
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <TaskList />
        </div>
      </div>
    </div>
  );
}