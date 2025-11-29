import React, { useState } from 'react';
import { Glasses, Plus, Battery, Settings, X, Smartphone, QrCode, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getThemeClasses } from '../../utils/themeUtils';

// --- Types ---
interface Device {
    id: string;
    name: string;
    status: 'connected' | 'disconnected';
    lastSync: string;
    batteryLevel?: number;
}

// --- Pairing Modal Component ---
interface PairingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPairingComplete: (device: Device) => void;
}

const PairingModal: React.FC<PairingModalProps> = ({ isOpen, onClose, onPairingComplete }) => {
    const { state } = useApp();
    const [step, setStep] = useState<'scan' | 'connecting' | 'success'>('scan');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSimulatePairing = () => {
        setStep('connecting');
        // Simulate network delay
        setTimeout(() => {
            setStep('success');
            // Simulate success delay
            setTimeout(() => {
                const newDevice: Device = {
                    id: `neo-glass-${Date.now()}`,
                    name: 'Neo Glass',
                    status: 'connected',
                    lastSync: 'Just now',
                    batteryLevel: 100
                };
                onPairingComplete(newDevice);
                setStep('scan'); // Reset for next time
            }, 1500);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className={`w-full max-w-md rounded-2xl shadow-2xl transform transition-all scale-100 ${state.theme === 'dark' ? 'bg-gray-900 border border-gray-700 text-white' : 'bg-white text-gray-900'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-xl font-bold">Pair AI Glasses</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center text-center">
                    {step === 'scan' && (
                        <>
                            <div className="relative group cursor-pointer mb-6">
                                <div className={`w-48 h-48 rounded-2xl flex items-center justify-center border-2 border-dashed ${state.theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                                    }`}>
                                    <QrCode className={`w-24 h-24 ${state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-2xl">
                                    <span className="text-white font-medium">Scan QR Code</span>
                                </div>
                            </div>

                            <p className={`mb-6 ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Open the NeuroPilot app on your glasses and enter or scan this code to pair.
                            </p>

                            <button
                                onClick={handleSimulatePairing}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <Smartphone className="w-5 h-5" />
                                Simulate Pairing
                            </button>
                        </>
                    )}

                    {step === 'connecting' && (
                        <div className="py-8 flex flex-col items-center">
                            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                            <h4 className="text-lg font-semibold mb-2">Connecting to Device...</h4>
                            <p className="text-gray-500">Establishing secure connection</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-8 flex flex-col items-center animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h4 className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">Device Paired!</h4>
                            <p className="text-gray-500">Neo Glass is now connected</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Card Component ---
export function AIGlassesCard() {
    const { state, dispatch } = useApp();
    const themeClasses = getThemeClasses(state.theme);
    const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);

    // Use global state for devices, but fallback to local mock if needed for the demo requirement
    // The user requirement says "Start with empty devices array, and after simulated pairing push..."
    // We'll use the global state 'glassDevices' which we already set up.
    const connectedDevices = state.glassDevices || [];

    const handlePairingComplete = (newDevice: Device) => {
        // Dispatch to global state
        dispatch({ type: 'ADD_DEVICE', payload: newDevice as any });
        setIsPairingModalOpen(false);
    };

    const navigateToGlasses = () => {
        dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'ai-glasses' });
    };

    return (
        <>
            <div
                onClick={navigateToGlasses}
                className={`h-full p-6 rounded-2xl shadow-lg border relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer ${state.theme === 'dark'
                        ? 'bg-gradient-to-br from-teal-900/40 to-purple-900/40 border-teal-800/30'
                        : 'bg-gradient-to-br from-teal-50 to-purple-50 border-teal-100'
                    }`}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`p-3 rounded-xl ${state.theme === 'dark' ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-600'
                        }`}>
                        <Glasses className="w-6 h-6" />
                    </div>

                    {connectedDevices.length > 0 && (
                        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${state.theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'
                            }`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            Connected
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <h3 className={`text-lg font-bold mb-1 ${themeClasses.text}`}>AI Glasses</h3>

                    {connectedDevices.length === 0 ? (
                        <>
                            <p className={`text-sm mb-4 ${themeClasses.textSecondary}`}>
                                No devices connected
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click navigation
                                    setIsPairingModalOpen(true);
                                }}
                                className={`w-full py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2 ${state.theme === 'dark'
                                        ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white hover:from-teal-500 hover:to-purple-500'
                                        : 'bg-gradient-to-r from-teal-500 to-purple-500 text-white hover:from-teal-400 hover:to-purple-400'
                                    }`}
                            >
                                <Plus className="w-4 h-4" />
                                Pair Device
                            </button>
                        </>
                    ) : (
                        <div className="space-y-3">
                            <p className={`text-sm ${themeClasses.textSecondary}`}>
                                {connectedDevices.length} device(s) connected
                            </p>

                            <div className={`p-3 rounded-xl border ${state.theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-white/60 border-white/40'
                                }`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`font-medium text-sm ${themeClasses.text}`}>
                                        {connectedDevices[0].name}
                                    </span>
                                    {connectedDevices[0].batteryLevel && (
                                        <div className="flex items-center gap-1 text-xs text-green-500">
                                            <Battery className="w-3 h-3" />
                                            {connectedDevices[0].batteryLevel}%
                                        </div>
                                    )}
                                </div>
                                <div className={`text-xs ${themeClasses.textSecondary}`}>
                                    Synced: {connectedDevices[0].lastSync}
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateToGlasses();
                                }}
                                className={`text-xs font-medium hover:underline flex items-center gap-1 ${state.theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                                    }`}
                            >
                                Manage devices
                                <Settings className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
            </div>

            <PairingModal
                isOpen={isPairingModalOpen}
                onClose={() => setIsPairingModalOpen(false)}
                onPairingComplete={handlePairingComplete}
            />
        </>
    );
}
