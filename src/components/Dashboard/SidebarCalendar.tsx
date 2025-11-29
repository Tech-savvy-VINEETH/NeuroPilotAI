import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Video, MoreHorizontal, Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isToday } from 'date-fns';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export function SidebarCalendar() {
    const { state } = useApp();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="font-semibold text-lg text-[var(--text-primary)]">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-7 w-7">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-7 w-7">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const dateFormat = "EEEEE";
        const startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center text-xs font-medium text-[var(--text-secondary)] py-1">
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mb-1">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;

                const hasMeeting = state.meetings.some(m => isSameDay(new Date(m.startTime), day) && m.status !== 'completed');
                const hasTask = state.tasks.some(t => t.dueDate && isSameDay(new Date(t.dueDate), day) && t.status !== 'completed');
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);

                days.push(
                    <div
                        key={day.toString()}
                        className={cn(
                            "relative aspect-square p-1 flex items-center justify-center cursor-pointer rounded-full transition-all duration-200",
                            !isCurrentMonth && "text-[var(--text-secondary)] opacity-30",
                            isSelected
                                ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
                                : "hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]",
                            isToday(day) && !isSelected && "text-teal-500 font-bold"
                        )}
                        onClick={() => setSelectedDate(cloneDay)}
                    >
                        <span className="text-xs">{formattedDate}</span>

                        {/* Indicators */}
                        <div className="absolute bottom-1 flex gap-0.5">
                            {hasMeeting && (
                                <div className={cn("w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-purple-500")} />
                            )}
                            {hasTask && !hasMeeting && (
                                <div className={cn("w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-blue-500")} />
                            )}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div>{rows}</div>;
    };

    // Filter events for selected date
    const selectedEvents = [
        ...state.meetings
            .filter(m => isSameDay(new Date(m.startTime), selectedDate) && m.status !== 'completed')
            .map(m => ({ ...m, type: 'meeting' as const })),
        ...state.tasks
            .filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate) && t.status !== 'completed')
            .map(t => ({ ...t, type: 'task' as const, startTime: t.dueDate })) // Normalize for sorting
    ].sort((a, b) => new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime());

    return (
        <Card className="p-4">
            {renderHeader()}
            {renderDays()}
            {renderCells()}

            {/* Selected Date Events */}
            <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                        {isToday(selectedDate) ? "Today's Schedule" : format(selectedDate, 'MMMM do')}
                    </h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Plus className="w-3.5 h-3.5" />
                    </Button>
                </div>

                <div className="space-y-2.5">
                    {selectedEvents.length > 0 ? (
                        selectedEvents.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 group"
                            >
                                <div className={cn(
                                    "p-2 rounded-lg shrink-0",
                                    event.type === 'meeting'
                                        ? "bg-purple-500/10 text-purple-500"
                                        : "bg-blue-500/10 text-blue-500"
                                )}>
                                    {event.type === 'meeting' ? <Video className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                        {event.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                        <span>
                                            {event.startTime && format(new Date(event.startTime), 'h:mm a')}
                                        </span>
                                        {event.type === 'meeting' && (
                                            <span className="px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 font-medium text-[10px]">
                                                Joinable
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {event.type === 'meeting' && (
                                    <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs bg-purple-500 hover:bg-purple-600 text-white">
                                        Join
                                    </Button>
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-xs text-center py-4 text-[var(--text-secondary)]">
                            No events scheduled
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}
