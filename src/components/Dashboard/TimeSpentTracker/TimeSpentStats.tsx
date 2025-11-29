import React from 'react';
import { timeTrackingService } from '../../../services/timeTrackingService';
import styles from './TimeSpentTracker.module.css';

interface Props {
    neuropilotTime: number;
    otherAppsTime: number;
    isTracking: boolean;
}

export const TimeSpentStats: React.FC<Props> = ({ neuropilotTime, otherAppsTime, isTracking }) => {
    return (
        <div className={styles.statsContainer}>
            <div className={styles.statSection}>
                <div className={styles.statHeader}>
                    <div className={`${styles.statusDot} ${isTracking ? styles.active : styles.idle}`} />
                    <span className={styles.statusLabel}>{isTracking ? 'Active' : 'Idle'}</span>
                </div>
                <div className={styles.statNumber}>{timeTrackingService.formatTime(neuropilotTime)}</div>
                <div className={styles.statLabel}>In NeuroPilot</div>
                <div className={styles.statSublabel}>Active time today</div>
            </div>

            <div className={styles.divider} />

            <div className={styles.statSection}>
                <div className={styles.statHeader}>
                    <div className={styles.statusDot} style={{ backgroundColor: 'var(--color-purple-600)' }} />
                </div>
                <div className={styles.statNumber}>{timeTrackingService.formatTime(otherAppsTime)}</div>
                <div className={styles.statLabel}>In Other Apps</div>
                <div className={styles.statSublabel}>Across 4 applications</div>
            </div>
        </div>
    );
};
