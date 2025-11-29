import React from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function UpcomingMeetingCard() {
    const { state, dispatch } = useApp();

    const now = new Date();
    const nextMeeting = state.meetings
        ?.filter(meeting => new Date(meeting.startTime) > now)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

    return (
        <div
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'meetings' })}
            className={`h-full p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg cursor-pointer ${state.theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${state.theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                    }`}>
                    <Clock className="w-6 h-6" />
                </div>
                {nextMeeting && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${state.theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                        }`}>
                        {new Date(nextMeeting.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </span>
                )}
            </div>
            {nextMeeting ? (
                <>
                    <h3 className={`text-lg font-bold mb-1 line-clamp-1 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {nextMeeting.title}
                    </h3>
                    <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        in {Math.max(0, Math.floor((new Date(nextMeeting.startTime).getTime() - Date.now()) / 60000))} mins • {nextMeeting.duration}m
                    </p>
                </>
            ) : (
                <>
                    <h3 className={`text-lg font-bold mb-1 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        No Upcoming Meetings
                    </h3>
                    <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        You're free for now!
                    </p>
                </>
            )}
        </div>
    );
}
