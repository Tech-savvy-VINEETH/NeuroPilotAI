import { useState, useEffect, useCallback } from 'react';
import { TimeSpentData, ChartData } from '../types/timeTracking.types';
import { timeTrackingService } from '../services/timeTrackingService';

export const useTimeTracking = () => {
    const [timeData, setTimeData] = useState<TimeSpentData>(timeTrackingService.getMockData());
    const [chartData, setChartData] = useState<ChartData>(
        timeTrackingService.calculateChartData(timeTrackingService.getMockData())
    );

    // Simulate time increment every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeData((prevData) => {
                // Randomly add 1-2 minutes to either NeuroPilot or Other Apps
                const addToNeuroPilot = Math.random() > 0.6;
                const incrementAmount = Math.floor(Math.random() * 2) + 1; // 1-2 minutes

                const newData = {
                    ...prevData,
                    totalNeuroPilotTime: addToNeuroPilot
                        ? prevData.totalNeuroPilotTime + incrementAmount
                        : prevData.totalNeuroPilotTime,
                    totalOtherAppsTime: !addToNeuroPilot
                        ? prevData.totalOtherAppsTime + incrementAmount
                        : prevData.totalOtherAppsTime,
                };

                // Update chart data
                setChartData(timeTrackingService.calculateChartData(newData));
                return newData;
            });
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, []);

    const getTopApps = useCallback(() => {
        return timeTrackingService.getTopApps(timeData.appBreakdown, 3);
    }, [timeData.appBreakdown]);

    return {
        timeData,
        chartData,
        topApps: getTopApps(),
    };
};
