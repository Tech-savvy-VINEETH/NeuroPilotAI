import React from 'react';
import { Mail, Star, Reply, Archive, Trash2, Clock, Filter, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function Emails() {
  const { state, dispatch } = useApp();

  const handleMarkAsRead = (emailId: string) => {
    dispatch({ type: 'MARK_EMAIL_READ', payload: emailId });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = state.emails.filter(email => !email.isRead).length;

  return (
    <div className="space-y-8 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Email Management
          </h1>
          <p className={`${
            state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            AI-powered email analysis and suggested responses
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`px-4 py-2 rounded-lg ${
            state.theme === 'dark' 
              ? 'bg-blue-900/30 text-blue-300' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            <span className="text-sm font-medium">{unreadCount} unread</span>
          </div>
        </div>
      </div>

      {/* Email Controls */}
      <div className={`${
        state.theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } rounded-xl border p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search emails..."
                className={`pl-10 pr-4 py-2 rounded-lg border ${
                  state.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
              state.theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${
              state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {state.emails.length} total emails
            </span>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className={`${
        state.theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } rounded-xl border shadow-lg overflow-hidden`}>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {state.emails.map((email, index) => (
            <div
              key={email.id}
              className={`p-6 transition-all duration-300 cursor-pointer ${
                state.theme === 'dark'
                  ? 'hover:bg-gray-750'
                  : 'hover:bg-gray-50'
              } ${
                !email.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
              }`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
              }}
              onClick={() => handleMarkAsRead(email.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    email.isRead
                      ? state.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}>
                    <Mail className={`w-5 h-5 ${
                      email.isRead ? 'text-gray-500' : 'text-white'
                    }`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      email.isRead
                        ? state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        : state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {email.sender}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(email.priority)}`}>
                        <Star className="w-3 h-3 mr-1" />
                        {email.priority}
                      </span>
                      <span className={`text-xs flex items-center ${
                        state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(email.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className={`p-2 rounded-lg transition-colors duration-200 ${
                    state.theme === 'dark'
                      ? 'text-gray-400 hover:text-green-400 hover:bg-green-900/20'
                      : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                  }`}>
                    <Reply className="w-4 h-4" />
                  </button>
                  <button className={`p-2 rounded-lg transition-colors duration-200 ${
                    state.theme === 'dark'
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                  }`}>
                    <Archive className="w-4 h-4" />
                  </button>
                  <button className={`p-2 rounded-lg transition-colors duration-200 ${
                    state.theme === 'dark'
                      ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'
                      : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                  }`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h2 className={`text-lg font-semibold mb-3 ${
                email.isRead
                  ? state.theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                  : state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {email.subject}
              </h2>

              <div className={`p-4 rounded-lg mb-4 ${
                state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className={`text-sm font-medium ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    AI Summary
                  </span>
                </div>
                <p className={`text-sm ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {email.summary}
                </p>
              </div>

              {email.suggestedReply && (
                <div className={`p-4 rounded-lg ${
                  state.theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Reply className={`w-4 h-4 ${
                      state.theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      state.theme === 'dark' ? 'text-green-400' : 'text-green-700'
                    }`}>
                      AI Suggested Reply
                    </span>
                  </div>
                  <p className={`text-sm mb-3 ${
                    state.theme === 'dark' ? 'text-green-300' : 'text-green-700'
                  }`}>
                    {email.suggestedReply}
                  </p>
                  <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    state.theme === 'dark'
                      ? 'bg-green-700 text-green-100 hover:bg-green-600'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}>
                    Use This Reply
                  </button>
                </div>
              )}
            </div>
          ))}

          {state.emails.length === 0 && (
            <div className={`text-center py-12 ${
              state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No emails to display</p>
              <p className="text-sm">Your inbox is empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}