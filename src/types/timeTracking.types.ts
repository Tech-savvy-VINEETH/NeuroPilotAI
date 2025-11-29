export interface AppTimeEntry {
    appName: string;
    appIcon: string;
    timeSpent: number; // minutes
    category: 'neuropilot' | 'communication' | 'entertainment' | 'productivity' | 'other';
    lastActiveTime: Date;
}

export interface TimeSpentData {
    totalNeuroPilotTime: number;
    totalOtherAppsTime: number;
    appBreakdown: AppTimeEntry[];
    trackingStartTime: Date;
    isTracking: boolean;
    totalScreenTime: number;
}

export interface ChartData {
    neuropilotPercentage: number;
    otherAppsPercentage: number;
    neuropilotTime: number;
    otherAppsTime: number;
}
