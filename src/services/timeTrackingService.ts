import { AppTimeEntry, TimeSpentData, ChartData } from '../types/timeTracking.types';

export const timeTrackingService = {
    // Format minutes to 'Xh Ym' format
    formatTime: (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    },

    // Calculate percentage
    calculatePercentage: (part: number, total: number): number => {
        if (total === 0) return 0;
        return Math.round((part / total) * 100);
    },

    // Sort apps by time spent (descending)
    sortAppsByTime: (apps: AppTimeEntry[]): AppTimeEntry[] => {
        return [...apps].sort((a, b) => b.timeSpent - a.timeSpent);
    },

    // Get top N apps
    getTopApps: (apps: AppTimeEntry[], limit: number = 3): AppTimeEntry[] => {
        return timeTrackingService.sortAppsByTime(apps).slice(0, limit);
    },

    // Format last activity time
    formatLastActivity: (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    },

    // Calculate chart data
    calculateChartData: (data: TimeSpentData): ChartData => {
        const total = data.totalNeuroPilotTime + data.totalOtherAppsTime;
        return {
            neuropilotPercentage: timeTrackingService.calculatePercentage(data.totalNeuroPilotTime, total),
            otherAppsPercentage: timeTrackingService.calculatePercentage(data.totalOtherAppsTime, total),
            neuropilotTime: data.totalNeuroPilotTime,
            otherAppsTime: data.totalOtherAppsTime,
        };
    },

    // Get mock data
    getMockData: (): TimeSpentData => {
        const now = new Date();
        return {
            totalNeuroPilotTime: 167, // 2h 47m
            totalOtherAppsTime: 323, // 5h 23m
            appBreakdown: [
                {
                    appName: 'Chrome',
                    appIcon: 'chrome',
                    timeSpent: 135,
                    category: 'other',
                    lastActiveTime: new Date(now.getTime() - 5 * 60000),
                },
                {
                    appName: 'Slack',
                    appIcon: 'slack',
                    timeSpent: 90,
                    category: 'communication',
                    lastActiveTime: new Date(now.getTime() - 12 * 60000),
                },
                {
                    appName: 'VS Code',
                    appIcon: 'vscode',
                    timeSpent: 68,
                    category: 'productivity',
                    lastActiveTime: new Date(now.getTime() - 3 * 60000),
                },
                {
                    appName: 'Spotify',
                    appIcon: 'spotify',
                    timeSpent: 30,
                    category: 'entertainment',
                    lastActiveTime: new Date(now.getTime() - 25 * 60000),
                },
            ],
            trackingStartTime: new Date(now.getTime() - 10 * 3600000),
            isTracking: true,
            totalScreenTime: 490,
        };
    },
};
