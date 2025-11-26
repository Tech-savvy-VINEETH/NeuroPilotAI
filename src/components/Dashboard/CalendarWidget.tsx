import { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { useApp } from '../../contexts/AppContext';
import { Plus, Globe2, CalendarDays, CheckCircle, Star, MoreHorizontal } from 'lucide-react';

// Google Public Holiday Calendar ID for US holidays (can be parameterized)
const HOLIDAY_CALENDAR_ID = 'en.usa#holiday@group.v.calendar.google.com';

const TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'US Eastern', value: 'America/New_York' },
  { label: 'US Central', value: 'America/Chicago' },
  { label: 'US Mountain', value: 'America/Denver' },
  { label: 'US Pacific', value: 'America/Los_Angeles' },
  { label: 'London', value: 'Europe/London' },
  { label: 'Berlin', value: 'Europe/Berlin' },
  { label: 'India', value: 'Asia/Kolkata' },
  { label: 'Singapore', value: 'Asia/Singapore' },
  { label: 'Tokyo', value: 'Asia/Tokyo' },
];

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix = [];
  let week = [];
  // Start from the Sunday before or on the first day of the month
  let day = new Date(firstDay);
  day.setDate(day.getDate() - day.getDay());
  // End on the Saturday after or on the last day of the month
  const endDay = new Date(lastDay);
  endDay.setDate(endDay.getDate() + (6 - endDay.getDay()));
  while (day <= endDay) {
    week.push(new Date(day));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
    day.setDate(day.getDate() + 1);
  }
  return matrix;
}

export function CalendarWidget() {
  const { state, dispatch } = useApp();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [timezone, setTimezone] = useState<string>('UTC');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('googleAccessToken');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  // Real-time clock for selected timezone
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setCurrentTime(
        new Intl.DateTimeFormat('en-US', {
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: false, timeZone: timezone
        }).format(now)
      );
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  // Fetch events for the visible month
  useEffect(() => {
    if (accessToken) {
      const timeMin = new Date(year, month, 1).toISOString();
      const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
      fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
        .then(res => res.json())
        .then(data => setEvents(data.items || []));
    }
  }, [accessToken, month, year]);

  // Fetch holidays for the visible month
  useEffect(() => {
    if (accessToken) {
      const timeMin = new Date(year, month, 1).toISOString();
      const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
      fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(HOLIDAY_CALENDAR_ID)}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
        .then(res => res.json())
        .then(data => setHolidays(data.items || []));
    }
  }, [accessToken, month, year]);

  // Get tasks for a specific date
  function getTasksForDate(date: Date) {
    return state.tasks.filter(task => {
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      return due.getFullYear() === date.getFullYear() &&
        due.getMonth() === date.getMonth() &&
        due.getDate() === date.getDate();
    });
  }

  // Get events for a specific date
  function getEventsForDate(date: Date) {
    return events.filter(event => {
      const start = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date);
      return start.getFullYear() === date.getFullYear() &&
        start.getMonth() === date.getMonth() &&
        start.getDate() === date.getDate();
    });
  }

  // Get holidays for a specific date
  function getHolidaysForDate(date: Date) {
    return holidays.filter(event => {
      const start = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date);
      return start.getFullYear() === date.getFullYear() &&
        start.getMonth() === date.getMonth() &&
        start.getDate() === date.getDate();
    });
  }

  function handleAddTask(date: Date) {
    setSelectedDate(date);
    setShowModal(true);
    setNewTaskTitle('');
    setNewTaskDesc('');
  }

  function handleSaveTask() {
    if (!selectedDate || !newTaskTitle.trim()) return;
    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: newTaskDesc,
        priority: 'medium',
        status: 'pending',
        dueDate: selectedDate,
        estimatedTime: 60,
        tags: [],
        category: 'work',
        createdAt: new Date(),
        isAIGenerated: false
      }
    });
    setShowModal(false);
  }

  const monthMatrix = getMonthMatrix(year, month);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-blue-700 dark:text-blue-300" />
          <select
            className="rounded-lg border px-2 py-1 text-sm bg-white dark:bg-gray-900 dark:text-white"
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
          >
            {TIMEZONES.map(tz => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-700 dark:text-blue-300" />
          <span className="font-mono text-lg font-semibold text-blue-900 dark:text-blue-200">{currentTime}</span>
          <span className="text-xs text-gray-500 ml-2">({timezone})</span>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300 flex items-center">
        <span className="mr-2">📅</span> Calendar & Focus Time
      </h2>
      {!accessToken ? (
        <div className="flex flex-col items-center">
          <GoogleLogin
            onSuccess={credentialResponse => {
              if (credentialResponse.credential) {
                setAccessToken(credentialResponse.credential);
                localStorage.setItem('googleAccessToken', credentialResponse.credential);
              }
            }}
            onError={() => {
              alert('Google Login Failed');
            }}
            useOneTap
          />
          <p className="mt-4 text-gray-500 text-sm">Connect your Google Calendar to see your meetings, holidays, and tasks.</p>
        </div>
      ) : (
        <div>
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => {
              if (month === 0) {
                setMonth(11);
                setYear(year - 1);
              } else {
                setMonth(month - 1);
              }
            }} className="px-3 py-1 rounded bg-blue-200 text-blue-900 font-semibold hover:bg-blue-300">&#60;</button>
            <span className="font-bold text-lg">{monthNames[month]} {year}</span>
            <button onClick={() => {
              if (month === 11) {
                setMonth(0);
                setYear(year + 1);
              } else {
                setMonth(month + 1);
              }
            }} className="px-3 py-1 rounded bg-blue-200 text-blue-900 font-semibold hover:bg-blue-300">&#62;</button>
          </div>
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center font-semibold text-blue-700 dark:text-blue-300 text-xs py-1">{day}</div>
            ))}
            {monthMatrix.flat().map((date, idx) => {
              const isCurrentMonth = date.getMonth() === month && date.getFullYear() === year;
              const isToday = date.toDateString() === new Date().toDateString();
              const tasks = getTasksForDate(date);
              const events = getEventsForDate(date);
              const hols = getHolidaysForDate(date);
              const items = [
                ...hols.map(h => ({ type: 'holiday', summary: h.summary })),
                ...events.map(e => ({ type: 'event', summary: e.summary })),
                ...tasks.map(t => ({ type: 'task', summary: t.title })),
              ];
              const visibleItems = items.slice(0, 2);
              const moreCount = items.length - visibleItems.length;
              return (
                <div
                  key={idx}
                  className={`relative group rounded-lg aspect-square min-h-[48px] max-h-[64px] border flex flex-col items-center transition-all duration-200 bg-white dark:bg-gray-900/60 ${isCurrentMonth ? '' : 'opacity-40'} ${isToday ? 'border-blue-500' : 'border-blue-100 dark:border-blue-800'} hover:border-blue-400`}
                  style={{ padding: 0 }}
                >
                  {/* Date number, centered, with circle for today */}
                  <div className="flex items-center justify-center w-full mt-1 mb-0.5">
                    <span className={`font-bold text-xs ${isToday ? 'bg-blue-500 text-white rounded-full px-2 py-0.5' : 'text-blue-900 dark:text-blue-100'}`}>{date.getDate()}</span>
                  </div>
                  {/* + button, only on hover */}
                  <button
                    className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-100 hover:bg-blue-300 dark:bg-blue-900/40 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-full p-1 shadow-sm"
                    style={{ lineHeight: 0 }}
                    title="Add Task"
                    onClick={() => handleAddTask(date)}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  {/* Items as colored dots or short text */}
                  <div className="flex-1 w-full flex flex-col items-center justify-start gap-0.5 px-1 overflow-hidden">
                    {visibleItems.map((item, i) => (
                      <div key={i} className={`flex items-center gap-1 text-[10px] w-full truncate ${item.type === 'holiday' ? 'text-green-700 dark:text-green-400' : item.type === 'event' ? 'text-blue-700 dark:text-blue-300' : 'text-purple-700 dark:text-purple-300'}`}
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {item.type === 'holiday' && <Star className="w-3 h-3 text-green-400" />}
                        {item.type === 'event' && <CalendarDays className="w-3 h-3 text-blue-400" />}
                        {item.type === 'task' && <CheckCircle className="w-3 h-3 text-purple-400" />}
                        <span className="truncate">{item.summary}</span>
                      </div>
                    ))}
                    {moreCount > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 w-full">
                        <MoreHorizontal className="w-3 h-3" /> +{moreCount} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Add Task Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Add Task for {selectedDate?.toLocaleDateString()}</h3>
                <input
                  className="w-full mb-2 p-2 rounded border"
                  placeholder="Task title"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                />
                <textarea
                  className="w-full mb-2 p-2 rounded border"
                  placeholder="Description (optional)"
                  value={newTaskDesc}
                  onChange={e => setNewTaskDesc(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">Cancel</button>
                  <button onClick={handleSaveTask} className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700">Add Task</button>
                </div>
              </div>
            </div>
          )}
          <button
            className="mt-4 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            onClick={() => {
              setAccessToken(null);
              localStorage.removeItem('googleAccessToken');
              googleLogout();
            }}
          >
            Disconnect Google Calendar
          </button>
        </div>
      )}
    </div>
  );
}