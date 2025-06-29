export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus: string;
  }>;
}

export interface FocusTimeAnalysis {
  totalFocusTime: number; // in minutes
  availableSlots: Array<{
    start: Date;
    end: Date;
    duration: number;
  }>;
  meetingLoad: number; // percentage of day in meetings
  suggestions: string[];
}

export class CalendarService {
  private accessToken: string;
  private baseUrl: string = 'http://localhost:8000';
  
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getTodaysEvents(): Promise<CalendarEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/calendar/events/today`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  async getUpcomingEvents(days: number = 7): Promise<CalendarEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/calendar/events/upcoming?days=${days}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }

  analyzeFocusTime(events: CalendarEvent[]): FocusTimeAnalysis {
    const workingHours = { start: 9, end: 17 }; // 9 AM to 5 PM
    const today = new Date();
    const workStart = new Date(today.setHours(workingHours.start, 0, 0, 0));
    const workEnd = new Date(today.setHours(workingHours.end, 0, 0, 0));
    
    // Calculate total meeting time
    let totalMeetingTime = 0;
    const busySlots: Array<{ start: Date; end: Date }> = [];

    events.forEach(event => {
      if (event.start.dateTime && event.end.dateTime) {
        const start = new Date(event.start.dateTime);
        const end = new Date(event.end.dateTime);
        
        // Only count events within working hours
        if (start >= workStart && end <= workEnd) {
          const duration = (end.getTime() - start.getTime()) / (1000 * 60); // minutes
          totalMeetingTime += duration;
          busySlots.push({ start, end });
        }
      }
    });

    // Calculate available focus slots
    const availableSlots: Array<{ start: Date; end: Date; duration: number }> = [];
    let currentTime = new Date(workStart);

    busySlots.sort((a, b) => a.start.getTime() - b.start.getTime());

    busySlots.forEach(slot => {
      if (currentTime < slot.start) {
        const duration = (slot.start.getTime() - currentTime.getTime()) / (1000 * 60);
        if (duration >= 30) { // Only slots of 30+ minutes
          availableSlots.push({
            start: new Date(currentTime),
            end: new Date(slot.start),
            duration
          });
        }
      }
      currentTime = new Date(Math.max(currentTime.getTime(), slot.end.getTime()));
    });

    // Check for time after last meeting
    if (currentTime < workEnd) {
      const duration = (workEnd.getTime() - currentTime.getTime()) / (1000 * 60);
      if (duration >= 30) {
        availableSlots.push({
          start: new Date(currentTime),
          end: new Date(workEnd),
          duration
        });
      }
    }

    const totalWorkingMinutes = 8 * 60; // 8 hours
    const totalFocusTime = totalWorkingMinutes - totalMeetingTime;
    const meetingLoad = (totalMeetingTime / totalWorkingMinutes) * 100;

    // Generate suggestions
    const suggestions: string[] = [];
    if (meetingLoad > 70) {
      suggestions.push("High meeting load detected. Consider rescheduling non-critical meetings.");
    }
    if (availableSlots.length === 0) {
      suggestions.push("No focus blocks available. Try to create 2-hour focus blocks.");
    }
    if (totalFocusTime < 120) {
      suggestions.push("Limited focus time today. Prioritize your most important tasks.");
    }

    return {
      totalFocusTime,
      availableSlots,
      meetingLoad,
      suggestions
    };
  }

  async createEvent(event: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    try {
      const response = await fetch(`${this.baseUrl}/calendar/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.event || null;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return null;
    }
  }
}