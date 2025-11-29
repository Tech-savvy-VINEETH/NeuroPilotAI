import React, { useState } from 'react';
import { AppTimeEntry } from '../../../types/timeTracking.types';
import { timeTrackingService } from '../../../services/timeTrackingService';
import styles from './TimeSpentTracker.module.css';

interface Props {
    apps: AppTimeEntry[];
}

export const AppTimeBreakdown: React.FC<Props> = ({ apps }) => {
    const [hoveredApp, setHoveredApp] = useState<string | null>(null);

    const getAppIcon = (iconName: string) => {
        // Map app names to icon emojis/symbols (can be replaced with icon library)
        const iconMap: { [key: string]: string } = {
            chrome: '🌐',
            slack: '💬',
            vscode: '📝',
            spotify: '🎵',
        };
        return iconMap[iconName] || '📱';
    };

    return (
        <div className={styles.breakdownContainer}>
            <div className={styles.breakdownTitle}>Top Apps</div>
            <div className={styles.appsList}>
                {apps.map((app) => (
                    <div
                        key={app.appName}
                        className={styles.appItem}
                        onMouseEnter={() => setHoveredApp(app.appName)}
                        onMouseLeave={() => setHoveredApp(null)}
                    >
                        <div className={styles.appIcon}>{getAppIcon(app.appIcon)}</div>
                        <div className={styles.appInfo}>
                            <div className={styles.appName}>{app.appName}</div>
                            <div className={styles.appTime}>{timeTrackingService.formatTime(app.timeSpent)}</div>
                        </div>
                        {hoveredApp === app.appName && (
                            <div className={styles.appTooltip}>
                                Last active: {timeTrackingService.formatLastActivity(app.lastActiveTime)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
