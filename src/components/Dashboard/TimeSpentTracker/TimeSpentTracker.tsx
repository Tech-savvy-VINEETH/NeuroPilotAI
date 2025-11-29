import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import { useTimeTracking } from '../../../hooks/useTimeTracking';
import { useAppDetection } from '../../../hooks/useAppDetection';
import { TimeSpentStats } from './TimeSpentStats';
import { AppTimeBreakdown } from './AppTimeBreakdown';
import { TimeChart } from './TimeChart';
import styles from './TimeSpentTracker.module.css';

export const TimeSpentTracker: React.FC = () => {
    const { dispatch } = useApp();
    const { timeData, chartData, topApps } = useTimeTracking();
    const { isTracking } = useAppDetection();

    const handleCardClick = () => {
        dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'analytics-time-spent' });
    };

    return (
        <div className={styles.card} onClick={handleCardClick} role="button" tabIndex={0}>
            <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                    <div className={styles.icon}>⏱️</div>
                    <div>
                        <h3 className={styles.title}>Time Spent Today</h3>
                        <p className={styles.subtitle}>Track your focus</p>
                    </div>
                </div>
                <div className={styles.viewDetailsBtn}>View Details →</div>
            </div>

            <div className={styles.cardContent}>
                <TimeSpentStats
                    neuropilotTime={timeData.totalNeuroPilotTime}
                    otherAppsTime={timeData.totalOtherAppsTime}
                    isTracking={isTracking}
                />

                <AppTimeBreakdown apps={topApps} />

                <TimeChart chartData={chartData} />
            </div>
        </div>
    );
};
