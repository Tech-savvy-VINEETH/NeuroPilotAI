import { useState, useEffect } from 'react';
import { CalendarService, CalendarEvent, FocusTimeAnalysis } from '../services/calendarService';

export function useCalendar(accessToken: string | null) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [todaysEvents, setTodaysEvents] = useState<CalendarEvent[]>([]);
  const [focusAnalysis, setFocusAnalysis] = useState<FocusTimeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calendarService = accessToken ? new CalendarService(accessToken) : null;

  const fetchTodaysEvents = async () => {
    if (!calendarService) return;

    try {
      setLoading(true);
      setError(null);
      const todayEvents = await calendarService.getTodaysEvents();
      setTodaysEvents(todayEvents);
      
      // Analyze focus time
      const analysis = calendarService.analyzeFocusTime(todayEvents);
      setFocusAnalysis(analysis);
    } catch (err) {
      setError('Failed to fetch calendar events');
      console.error('Calendar fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingEvents = async (days: number = 7) => {
    if (!calendarService) return;

    try {
      setLoading(true);
      const upcomingEvents = await calendarService.getUpcomingEvents(days);
      setEvents(upcomingEvents);
    } catch (err) {
      setError('Failed to fetch upcoming events');
      console.error('Calendar fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Partial<CalendarEvent>) => {
    if (!calendarService) return null;

    try {
      const newEvent = await calendarService.createEvent(eventData);
      if (newEvent) {
        // Refresh events
        await fetchTodaysEvents();
        await fetchUpcomingEvents();
      }
      return newEvent;
    } catch (err) {
      setError('Failed to create event');
      console.error('Event creation error:', err);
      return null;
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchTodaysEvents();
      fetchUpcomingEvents();
    }
  }, [accessToken]);

  return {
    events,
    todaysEvents,
    focusAnalysis,
    loading,
    error,
    fetchTodaysEvents,
    fetchUpcomingEvents,
    createEvent,
    refreshEvents: () => {
      fetchTodaysEvents();
      fetchUpcomingEvents();
    }
  };
}