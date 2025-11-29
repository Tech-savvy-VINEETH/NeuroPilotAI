import React, { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Search, Video, Users, Clock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { MeetingCard } from '../components/Meetings/MeetingCard';
import { MeetingRoom } from '../components/Meetings/MeetingRoom';
import { MeetingSummaryModal } from '../components/Meetings/MeetingSummaryModal';
import { Meeting } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Meetings() {
    const { state, dispatch } = useApp();
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);
    const [summaryMeetingId, setSummaryMeetingId] = useState<string | null>(null);

    // Fetch meetings on mount
    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await fetch('http://localhost:3000/calendar/events/upcoming');
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'success') {
                        // Transform backend data to match frontend Meeting interface if needed
                        // For now assuming backend returns compatible structure or using mock fallback
                        // dispatch({ type: 'SET_MEETINGS', payload: data.events });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch meetings:', error);
            }
        };

        fetchMeetings();
    }, [dispatch]);

    const upcomingMeetings = state.meetings
        .filter(m => m.status === 'scheduled' || m.status === 'live')
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const pastMeetings = state.meetings
        .filter(m => m.status === 'completed')
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    const filteredMeetings = (filter === 'upcoming' ? upcomingMeetings : filter === 'past' ? pastMeetings : [...upcomingMeetings, ...pastMeetings])
        .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleJoinMeeting = (id: string) => {
        setActiveMeetingId(id);
    };

    const handleEndMeeting = () => {
        if (activeMeetingId) {
            // Simulate AI summary generation
            const mockSummary = {
                keyPoints: [
                    'Discussed Q1 roadmap and key deliverables',
                    'Agreed to prioritize mobile app performance optimization',
                    'Team to review new design mocks by Friday'
                ],
                actionItems: [
                    'Schedule follow-up with design team',
                    'Update project timeline in Jira',
                    'Send meeting minutes to stakeholders'
                ]
            };

            dispatch({
                type: 'END_MEETING',
                payload: {
                    id: activeMeetingId,
                    summary: mockSummary
                }
            });
            setActiveMeetingId(null);
            // Automatically show summary after ending
            setSummaryMeetingId(activeMeetingId);
        }
    };

    const handleViewSummary = (id: string) => {
        setSummaryMeetingId(id);
    };

    const handleScheduleMeeting = async () => {
        // In a real app, this would open a modal form
        // For now, we'll create a mock meeting via API
        const newMeeting: Meeting = {
            id: Date.now().toString(),
            title: 'New Meeting',
            startTime: new Date(Date.now() + 3600000), // 1 hour from now
            duration: 30,
            participants: ['You'],
            status: 'scheduled',
            platform: 'neuropilot'
        };

        try {
            // Optimistic update
            dispatch({ type: 'ADD_MEETING', payload: newMeeting });
        } catch (error) {
            console.error('Failed to schedule meeting:', error);
        }
    };

    const activeMeeting = state.meetings.find(m => m.id === activeMeetingId);
    const summaryMeeting = state.meetings.find(m => m.id === summaryMeetingId);

    return (
        <div className="max-w-6xl mx-auto h-full flex flex-col space-y-6 animate-fade-in">
            {activeMeeting && (
                <MeetingRoom
                    meeting={activeMeeting}
                    onEnd={handleEndMeeting}
                />
            )}

            <MeetingSummaryModal
                meeting={summaryMeeting || null}
                isOpen={!!summaryMeetingId}
                onClose={() => setSummaryMeetingId(null)}
            />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-[var(--text-primary)] tracking-tight">
                        Meetings
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Manage your schedule and join video calls
                    </p>
                </div>
                <Button
                    onClick={handleScheduleMeeting}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Meeting
                </Button>
            </div>

            {/* Controls Section */}
            <Card className="p-4 bg-[var(--bg-secondary)]/50 backdrop-blur-md border-[var(--border-color)]">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                        <Input
                            type="text"
                            placeholder="Search meetings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-[var(--bg-primary)] border-[var(--border-color)] focus:ring-blue-500/20"
                        />
                    </div>
                    <div className="flex p-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]">
                        {(['all', 'upcoming', 'past'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                                    filter === f
                                        ? "bg-blue-500 text-white shadow-sm"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                                )}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Meetings Grid */}
            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredMeetings.length > 0 ? (
                        filteredMeetings.map(meeting => (
                            <motion.div
                                key={meeting.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MeetingCard
                                    meeting={meeting}
                                    onJoin={handleJoinMeeting}
                                    onViewSummary={handleViewSummary}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 rounded-2xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)]/30"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                                <CalendarIcon className="w-8 h-8 text-[var(--text-secondary)] opacity-50" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1 text-[var(--text-primary)]">No meetings found</h3>
                            <p className="text-[var(--text-secondary)] max-w-xs mx-auto">
                                {searchQuery ? 'Try adjusting your search terms' : 'Schedule a new meeting to get started with your team'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
