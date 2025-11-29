import React from 'react';
import { Calendar, Clock, Users, Video, PlayCircle, FileText } from 'lucide-react';
import { Meeting } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface MeetingCardProps {
    meeting: Meeting;
    onJoin?: (id: string) => void;
    onViewSummary?: (id: string) => void;
}

export function MeetingCard({ meeting, onJoin, onViewSummary }: MeetingCardProps) {
    const { state } = useApp();
    const isDark = state.theme === 'dark';

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const isUpcoming = meeting.status === 'scheduled';
    const isLive = meeting.status === 'live';

    return (
        <div className={`p-4 rounded-xl border transition-all ${isDark
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
            }`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {meeting.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${meeting.platform === 'zoom' ? 'bg-blue-100 text-blue-700' :
                                meeting.platform === 'meet' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-purple-100 text-purple-700'
                            }`}>
                            {meeting.platform === 'neuropilot' ? 'NeuroPilot Meet' : meeting.platform}
                        </span>
                        {isLive && (
                            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                LIVE
                            </span>
                        )}
                    </div>
                </div>

                {isUpcoming && (
                    <button
                        onClick={() => onJoin?.(meeting.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Video className="w-4 h-4" />
                        Join
                    </button>
                )}
            </div>

            <div className={`flex flex-wrap gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(meeting.startTime)}
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatTime(meeting.startTime)} • {meeting.duration} min
                </div>
                <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {meeting.participants.length} participants
                </div>
            </div>

            {meeting.status === 'completed' && (
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                    {meeting.summary && (
                        <button
                            onClick={() => onViewSummary?.(meeting.id)}
                            className={`flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            View Summary
                        </button>
                    )}
                    {meeting.recordingUrl && (
                        <button
                            className={`flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                                }`}
                        >
                            <PlayCircle className="w-4 h-4" />
                            Recording
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
