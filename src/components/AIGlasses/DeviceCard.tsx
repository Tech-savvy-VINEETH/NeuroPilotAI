import React from 'react';
import { Battery, Wifi, Settings, Power, RefreshCw, Smartphone, Bluetooth } from 'lucide-react';
import { GlassDevice } from '../../types';
import { getThemeClasses } from '../../utils/themeUtils';

interface DeviceCardProps {
    device: GlassDevice;
    theme: 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'indigo' | 'teal';
    onDisconnect: (deviceId: string) => void;
    onSync: (deviceId: string) => void;
}

export function DeviceCard({ device, theme, onDisconnect, onSync }: DeviceCardProps) {
    const themeClasses = getThemeClasses(theme);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected': return 'text-green-500';
            case 'disconnected': return 'text-gray-400';
            case 'syncing': return 'text-blue-500';
            default: return 'text-gray-400';
        }
    };

    const getBatteryColor = (level: number) => {
        if (level > 50) return 'text-green-500';
        if (level > 20) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className={`${themeClasses.surfaceSecondary} rounded-xl p-6 border ${themeClasses.border} shadow-sm`}>
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full ${themeClasses.surface} flex items-center justify-center border ${themeClasses.border}`}>
                        <Smartphone className={`w-6 h-6 ${themeClasses.primaryText}`} />
                    </div>
                    <div>
                        <h3 className={`font-bold ${themeClasses.text}`}>{device.name}</h3>
                        <div className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${device.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className={`text-xs ${getStatusColor(device.status)} uppercase font-bold`}>
                                {device.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onSync(device.id)}
                        className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${themeClasses.textSecondary}`}
                        title="Sync"
                    >
                        <RefreshCw className={`w-5 h-5 ${device.status === 'syncing' ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${themeClasses.textSecondary}`}
                        title="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-3 rounded-lg ${themeClasses.surface} border ${themeClasses.border}`}>
                    <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Battery</span>
                        <Battery className={`w-4 h-4 ${getBatteryColor(device.batteryLevel)}`} />
                    </div>
                    <span className={`text-lg font-bold ${themeClasses.text}`}>{device.batteryLevel}%</span>
                </div>
                <div className={`p-3 rounded-lg ${themeClasses.surface} border ${themeClasses.border}`}>
                    <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Connection</span>
                        <Wifi className={`w-4 h-4 ${themeClasses.primaryText}`} />
                    </div>
                    <span className={`text-lg font-bold ${themeClasses.text}`}>5G / WiFi</span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className={themeClasses.textSecondary}>Last Synced</span>
                    <span className={themeClasses.text}>{new Date(device.lastSynced).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className={themeClasses.textSecondary}>Firmware</span>
                    <span className={themeClasses.text}>{device.firmwareVersion}</span>
                </div>
            </div>

            <div className={`mt-6 pt-4 border-t ${themeClasses.border}`}>
                <button
                    onClick={() => onDisconnect(device.id)}
                    className="w-full py-2 flex items-center justify-center space-x-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <Power className="w-4 h-4" />
                    <span className="font-medium">Disconnect Device</span>
                </button>
            </div>
        </div>
    );
}
