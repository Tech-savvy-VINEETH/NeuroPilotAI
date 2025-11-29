import { useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';

export function useProactiveSuggestions() {
    const { state, dispatch } = useApp();
    const lastSuggestionTime = useRef<number>(0);
    const processedMeetingIds = useRef<Set<string>>(new Set());

    // Helper to send a message
    const sendSuggestion = (content: string, action?: any) => {
        const now = Date.now();
        // Prevent spamming: at least 5 minutes between suggestions
        if (now - lastSuggestionTime.current < 5 * 60 * 1000) return;

        if (state.activeChatSessionId) {
            const message = {
                id: Date.now().toString(),
                sessionId: state.activeChatSessionId,
                type: 'assistant' as const,
                content,
                timestamp: new Date(),
                relatedAction: action
            };

            dispatch({
                type: 'ADD_MESSAGE_TO_SESSION',
                payload: { sessionId: state.activeChatSessionId, message }
            });

            lastSuggestionTime.current = now;
        }
    };

    // Check for upcoming meetings
    useEffect(() => {
        const checkMeetings = () => {
            const now = new Date();
            state.meetings.forEach(meeting => {
                if (processedMeetingIds.current.has(meeting.id)) return;

                const timeDiff = new Date(meeting.startTime).getTime() - now.getTime();
                const minutesUntil = Math.floor(timeDiff / 1000 / 60);

                // Suggestion window: 10-15 minutes before meeting
                if (minutesUntil >= 10 && minutesUntil <= 15) {
                    sendSuggestion(
                        `📅 You have "${meeting.title}" coming up in ${minutesUntil} minutes. Would you like me to prepare a quick summary or list of participants?`,
                        {
                            type: 'meeting_prep',
                            status: 'proposed',
                            data: { meetingId: meeting.id, title: meeting.title }
                        }
                    );
                    processedMeetingIds.current.add(meeting.id);
                }
            });
        };

        const interval = setInterval(checkMeetings, 60000); // Check every minute
        checkMeetings(); // Initial check

        return () => clearInterval(interval);
    }, [state.meetings]);

    // Check for high workload / prioritization
    useEffect(() => {
        const highPriorityPending = state.tasks.filter(
            t => t.priority === 'high' && t.status === 'pending'
        ).length;

        if (highPriorityPending >= 3) {
            // Only suggest if we haven't suggested recently (handled by sendSuggestion)
            // and maybe add a specific check to not annoy the user about the same thing
            const hasRecentPrioritizationMsg = state.chatSessions
                .find(s => s.id === state.activeChatSessionId)
                ?.messages.some(m =>
                    m.type === 'assistant' &&
                    m.timestamp.getTime() > Date.now() - 24 * 60 * 60 * 1000 &&
                    m.content.includes('prioritizing')
                );

            if (!hasRecentPrioritizationMsg) {
                sendSuggestion(
                    `I noticed you have ${highPriorityPending} high-priority tasks pending. 📝 Would you like help prioritizing them or breaking them down?`
                );
            }
        }
    }, [state.tasks, state.activeChatSessionId]);

    // Check for long focus sessions (simulated for now as we don't track active time precisely in state yet)
    // This could be enhanced with the AppUsageTimer logic if moved to context
}
