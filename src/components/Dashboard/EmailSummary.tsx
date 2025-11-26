import React, { useState } from 'react';
import { Mail, Clock, Reply, Star, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAI } from '../../hooks/useAI';

export function EmailSummary() {
  const { state, dispatch } = useApp();
  const { generateEmailReply, isProcessing } = useAI();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatingReply, setGeneratingReply] = useState<string | null>(null);

  const handleMarkAsRead = (emailId: string) => {
    dispatch({ type: 'MARK_EMAIL_READ', payload: emailId });
  };

  const handleToggleExpanded = (emailId: string) => {
    dispatch({ type: 'TOGGLE_EMAIL_EXPANDED', payload: emailId });
  };

  const handleCopyReply = async (text: string, emailId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(emailId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleGenerateReply = async (emailId: string, emailContent: string) => {
    setGeneratingReply(emailId);
    try {
      const reply = await generateEmailReply(emailContent, 'Professional response');
      // Update email with generated reply
      // In a real app, you'd dispatch an action to update the email
      console.log('Generated reply:', reply);
    } catch (error) {
      console.error('Error generating reply:', error);
    } finally {
      setGeneratingReply(null);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Star className="w-4 h-4 text-red-500 fill-current" />;
      case 'medium':
        return <Star className="w-4 h-4 text-orange-500 fill-current" />;
      default:
        return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityLabel = (subject: string, content: string) => {
    const text = (subject + ' ' + content).toLowerCase();
    if (text.includes('urgent') || text.includes('asap') || text.includes('immediate')) {
      return { label: 'Urgent', color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300' };
    }
    if (text.includes('required') || text.includes('deadline')) {
      return { label: 'Required', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' };
    }
    if (text.includes('reminder') || text.includes('follow up')) {
      return { label: 'Reminder', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' };
    }
    return null;
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

  // Group emails by domain
  const emailsByDomain = state.emails.reduce((acc, email) => {
    const domain = email.domain || 'other';
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(email);
    return acc;
  }, {} as Record<string, typeof state.emails>);

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
          Email Summary
        </h2>
        <button
          onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'emails' })}
          className={`text-sm px-3 py-1 rounded-lg font-semibold transition-colors duration-200 ${
            state.theme === 'dark'
              ? 'text-blue-400 hover:bg-blue-900/20'
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          View All
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(emailsByDomain).map(([domain, emails]) => (
          <div key={domain}>
            <h3 className={`text-sm font-semibold mb-3 ${
              state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {domain} ({emails.length})
            </h3>
            
            <div className="space-y-4">
              {emails.slice(0, 2).map((email, index) => {
                const priorityLabel = getPriorityLabel(email.subject, email.content || '');
                
                return (
                  <div
                    key={email.id}
                    className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md cursor-pointer ${
                      email.isRead
                        ? state.theme === 'dark'
                          ? 'bg-gray-750 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                        : state.theme === 'dark'
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-blue-50 border-blue-200'
                    }`}
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <Mail className={`w-4 h-4 flex-shrink-0 ${
                          email.isRead
                            ? state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            : state.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <span className={`font-semibold text-sm truncate ${
                          email.isRead
                            ? state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            : state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {email.sender}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {priorityLabel && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${priorityLabel.color}`}>
                            {priorityLabel.label}
                          </span>
                        )}
                        {getPriorityIcon(email.priority)}
                        <span className={`text-xs whitespace-nowrap ${
                          state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {formatTime(email.timestamp)}
                        </span>
                      </div>
                    </div>

                    <h3 className={`font-semibold mb-2 break-words ${
                      email.isRead
                        ? state.theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                        : state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {email.subject}
                    </h3>

                    <p className={`text-sm mb-3 ${
                      state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    } ${email.isExpanded ? '' : 'line-clamp-2'}`}>
                      {email.summary}
                    </p>

                    {email.content && (
                      <div className="mb-3">
                        <button
                          onClick={() => handleToggleExpanded(email.id)}
                          className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                            state.theme === 'dark'
                              ? 'text-blue-400 hover:text-blue-300'
                              : 'text-blue-600 hover:text-blue-700'
                          }`}
                        >
                          <span>{email.isExpanded ? 'Read less' : 'Read more'}</span>
                          {email.isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        
                        {email.isExpanded && (
                          <div className={`mt-3 p-3 rounded-lg ${
                            state.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                          }`}>
                            <p className={`text-sm break-words whitespace-pre-wrap ${
                              state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {email.content}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {email.suggestedReply && (
                      <div className={`p-3 rounded-lg ${
                        state.theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Reply className={`w-4 h-4 ${
                              state.theme === 'dark' ? 'text-green-400' : 'text-green-600'
                            }`} />
                            <span className={`text-xs font-semibold ${
                              state.theme === 'dark' ? 'text-green-400' : 'text-green-700'
                            }`}>
                              AI Suggested Reply
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopyReply(email.suggestedReply!, email.id)}
                            className={`p-1 rounded transition-colors duration-200 ${
                              state.theme === 'dark'
                                ? 'hover:bg-green-800/30 text-green-400'
                                : 'hover:bg-green-200 text-green-600'
                            }`}
                            title="Copy to clipboard"
                          >
                            {copiedId === email.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className={`text-sm break-words whitespace-pre-wrap ${
                          state.theme === 'dark' ? 'text-green-300' : 'text-green-700'
                        }`}>
                          {email.suggestedReply}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={() => handleMarkAsRead(email.id)}
                        className={`text-sm px-3 py-1 rounded-lg font-medium transition-colors duration-200 ${
                          email.isRead
                            ? state.theme === 'dark'
                              ? 'text-gray-500 bg-gray-700'
                              : 'text-gray-500 bg-gray-200'
                            : state.theme === 'dark'
                              ? 'text-blue-400 hover:bg-blue-900/20'
                              : 'text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        {email.isRead ? 'Read' : 'Mark as Read'}
                      </button>
                      
                      {!email.suggestedReply && (
                        <button
                          onClick={() => handleGenerateReply(email.id, email.content || email.summary)}
                          disabled={generatingReply === email.id}
                          className={`text-sm px-3 py-1 rounded-lg font-medium transition-colors duration-200 ${
                            state.theme === 'dark'
                              ? 'text-green-400 hover:bg-green-900/20'
                              : 'text-green-600 hover:bg-green-100'
                          } ${generatingReply === email.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {generatingReply === email.id ? 'Generating...' : 'Generate Reply'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {state.emails.length === 0 && (
          <div className={`text-center py-8 ${
            state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No emails to display</p>
          </div>
        )}
      </div>
    </div>
  );
}