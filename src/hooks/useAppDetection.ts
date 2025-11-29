import { useState, useEffect } from 'react';

export const useAppDetection = () => {
    const [isTracking, setIsTracking] = useState(true);
    const [isVisible, setIsVisible] = useState(!document.hidden);

    useEffect(() => {
        const handleFocus = () => {
            setIsTracking(true);
        };

        const handleBlur = () => {
            setIsTracking(false);
        };

        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden);
            if (document.hidden) {
                setIsTracking(false);
            } else {
                setIsTracking(true);
            }
        };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return {
        isTracking,
        isVisible,
    };
};
