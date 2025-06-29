import React from 'react';
import { Calendar, Clock, Users, MapPin, AlertCircle, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { CalendarEvent, FocusTimeAnalysis } from '../../services/calendarService';
import { format, isToday, isTomorrow } from 'date-fns';

interface CalendarWidgetProps {
  events: CalendarEvent[];
  focusAnalysis: FocusTimeAnalysis | null;
  loading: boolean;
}

export function CalendarWidget({ events, focusAnalysis, loading }: CalendarWidgetProps) {
  const { state } = useApp();

  const formatEventTime = (event: CalendarEvent) => {
    if (!event.start.dateTime) return 'All day';
    
    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime!);
    
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  };

  const getEventDate = (event: CalendarEvent) => {
    const date = new Date(event.start.dateTime || event.start.date!);
    
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className={`${
        state.theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } rounded-2xl border shadow-lg p-6`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${
      state.theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } rounded-2xl border shadow-lg p-6 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${
          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Calendar & Focus Time
        </h2>
        <Calendar className={`w-5 h-5 ${
          state.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        }`} />
      </div>

      {/* Focus Time Analysis */}
      {focusAnalysis && (
        <div className={`p-4 rounded-xl mb-6 ${
          state.theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
        }`}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                state.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {formatFocusTime(focusAnalysis.totalFocusTime)}
              </div>
              <div className={`text-sm ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Focus Time Available
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                focusAnalysis.meetingLoad > 70 
                  ? 'text-red-500' 
                  : focusAnalysis.meetingLoad > 50 
                    ? 'text-orange-500' 
                    : 'text-green-500'
              }`}>
                {Math.round(focusAnalysis.meetingLoad)}%
              </div>
              <div className={`text-sm ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Meeting Load
              </div>
            </div>
          </div>

          {/* Available Focus Slots */}
          {focusAnalysis.availableSlots.length > 0 && (
            <div className="mb-4">
              <h4 className={`text-sm font-medium mb-2 ${
                state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Available Focus Blocks:
              </h4>
              <div className="space-y-1">
                {focusAnalysis.availableSlots.slice(0, 3).map((slot, index) => (
                  <div
                    key={index}
                    className={`text-xs px-2 py-1 rounded ${
                      state.theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {format(slot.start, 'h:mm a')} - {format(slot.end, 'h:mm a')} 
                    ({formatFocusTime(slot.duration)})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {focusAnalysis.suggestions.length > 0 && (
            <div className="space-y-2">
              {focusAnalysis.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-2 text-xs ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Today's Events */}
      <div className="space-y-4">
        <h3 className={`text-lg font-medium ${
          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Today's Schedule
        </h3>

        {events.length === 0 ? (
          <div className={`text-center py-6 ${
            state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No events scheduled for today</p>
            <p className="text-sm mt-1">Perfect day for deep focus work!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.slice(0, 4).map((event, index) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  state.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-650'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-medium mb-1 ${
                      state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {event.summary}
                    </h4>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className={`flex items-center space-x-1 ${
                        state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{formatEventTime(event)}</span>
                      </div>
                      
                      {event.location && (
                        <div className={`flex items-center space-x-1 ${
                          state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-24">{event.location}</span>
                        </div>
                      )}
                      
                      {event.attendees && event.attendees.length > 0 && (
                        <div className={`flex items-center space-x-1 ${
                          state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <Users className="w-3 h-3" />
                          <span>{event.attendees.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    state.theme === 'dark' 
                      ? 'bg-blue-900/30 text-blue-300' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {getEventDate(event)}
                  </div>
                </div>
              </div>
            ))}
            
            {events.length > 4 && (
              <div className={`text-center py-2 ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <span className="text-sm">+{events.length - 4} more events</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}