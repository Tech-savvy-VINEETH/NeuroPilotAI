import React, { useState } from 'react';
import { Glasses, Plus, Battery, Settings, MoreVertical, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getThemeClasses } from '../../utils/themeUtils';
import { DevicePairingModal } from './DevicePairingModal';

export function ConnectedDevicesWidget() {
    const { state, dispatch } = useApp();
    const themeClasses = getThemeClasses(state.theme);
    const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);

    // Filter for connected glasses from global state
    const connectedDevices = state.glassDevices || [];

    const handlePairingComplete = (newDevice: any) => {
        // In a real app, this would be handled by the backend and websocket
        // Here we dispatch to our context
        dispatch({ type: 'ADD_DEVICE', payload: newDevice });
        setIsPairingModalOpen(false);
    };

    return (
        <>
            <div className={`h-full p-6 rounded-2xl shadow-lg border relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${state.theme === 'dark'
                    ? 'bg-gradient-to-br from-teal-900/40 to-purple-900/40 border-teal-800/30'
                    : 'bg-gradient-to-br from-teal-50 to-purple-50 border-teal-100'
                }`}>
                {/* Header */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-xl ${state.theme === 'dark' ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-600'
                            }`}>
                            <Glasses className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className={`font-bold text-lg ${themeClasses.text}`}>AI Glasses</h3>
                            <p className={`text-xs font-medium ${connectedDevices.length > 0 ? 'text-green-500' : themeClasses.textSecondary
                                }`}>
                                {connectedDevices.length > 0 ? `${connectedDevices.length} Connected` : 'No devices'}
                            </p>
                        </div>
                    </div>

                    {connectedDevices.length > 0 && (
                        <button
                            onClick={() => setIsPairingModalOpen(true)}
                            className={`p-2 rounded-lg transition-colors ${state.theme === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-600'
                                }`}
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {connectedDevices.length === 0 ? (
                        <div className="text-center py-4">
                            <p className={`text-sm mb-4 ${themeClasses.textSecondary}`}>
                                Pair your AI Glasses to enable voice commands and smart features.
                            </p>
                            <button
                                onClick={() => setIsPairingModalOpen(true)}
                                className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${state.theme === 'dark'
                                        ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white hover:from-teal-500 hover:to-purple-500'
                                        : 'bg-gradient-to-r from-teal-500 to-purple-500 text-white hover:from-teal-400 hover:to-purple-400'
                                    }`}
                            >
                                <Plus className="w-5 h-5" />
                                <span>Pair Device</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {connectedDevices.map((device) => (
                                <div
                                    key={device.id}
                                    onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'ai-glasses' })}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all ${state.theme === 'dark'
                                            ? 'bg-black/20 border-white/10 hover:bg-black/30'
                                            : 'bg-white/60 border-white/40 hover:bg-white/80'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`font-medium ${themeClasses.text}`}>{device.name}</span>
                                        <div className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full ${device.status === 'connected'
                                                ? 'bg-green-500/20 text-green-500'
                                                : 'bg-gray-500/20 text-gray-500'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${device.status === 'connected' ? 'bg-green-500' : 'bg-gray-500'
                                                }`}></span>
                                            <span className="capitalize">{device.status}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <div className={`flex items-center space-x-1 ${device.batteryLevel > 20 ? 'text-green-500' : 'text-red-500'
                                            }`}>
                                            <Battery className="w-3.5 h-3.5" />
                                            <span>{device.batteryLevel}%</span>
                                        </div>
                                        <span className={themeClasses.textSecondary}>
                                            Synced {new Date(device.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
            </div>

            <DevicePairingModal
                isOpen={isPairingModalOpen}
                onClose={() => setIsPairingModalOpen(false)}
                onPairingComplete={handlePairingComplete}
            />
        </>
    );
}
