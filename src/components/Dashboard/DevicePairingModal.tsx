import React, { useState, useEffect } from 'react';
import { X, Smartphone, QrCode, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getThemeClasses } from '../../utils/themeUtils';

interface DevicePairingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPairingComplete: (device: any) => void;
}

export function DevicePairingModal({ isOpen, onClose, onPairingComplete }: DevicePairingModalProps) {
    const { state } = useApp();
    const themeClasses = getThemeClasses(state.theme);
    const [step, setStep] = useState<'scan' | 'connecting' | 'success' | 'failed'>('scan');
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        if (!isOpen) {
            setStep('scan');
            setTimeLeft(30);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Refresh QR code simulation
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen]);

    // Simulate pairing process
    const simulatePairing = () => {
        setStep('connecting');
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onPairingComplete({
                    id: `device-${Date.now()}`,
                    name: 'NeuroGlass Air',
                    model: 'NG-AIR-2024',
                    status: 'connected',
                    batteryLevel: 100,
                    lastSynced: new Date(),
                    firmwareVersion: '2.1.0',
                    serialNumber: 'NG-8839-XJ2'
                });
            }, 1500);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${themeClasses.surface} ${themeClasses.border} border`}>
                {/* Header */}
                <div className={`p-4 border-b ${themeClasses.border} flex justify-between items-center`}>
                    <h3 className={`font-semibold text-lg ${themeClasses.text}`}>Pair New Device</h3>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${themeClasses.textSecondary}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 'scan' && (
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="relative group cursor-pointer" onClick={simulatePairing}>
                                <div className={`w-64 h-64 rounded-xl border-2 border-dashed ${themeClasses.border} flex items-center justify-center bg-white p-4`}>
                                    <QrCode className="w-48 h-48 text-gray-800" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                        <span className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium text-gray-900">
                                            Click to Simulate Scan
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-8 left-0 right-0 text-center">
                                    <span className={`text-xs font-mono ${themeClasses.textSecondary}`}>
                                        Refreshing in {timeLeft}s
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className={`text-lg font-medium mb-2 ${themeClasses.text}`}>Scan with AI Glasses</h4>
                                <p className={`text-sm ${themeClasses.textSecondary}`}>
                                    Open the Settings app on your glasses and select "Pair New Device" to scan this code.
                                </p>
                            </div>

                            <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button className={`text-sm font-medium hover:underline ${themeClasses.primaryText}`}>
                                    Or enter manual pairing code
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'connecting' && (
                        <div className="flex flex-col items-center text-center py-12 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                                <div className="relative bg-blue-500 p-4 rounded-full">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            </div>
                            <div>
                                <h4 className={`text-lg font-medium mb-2 ${themeClasses.text}`}>Connecting...</h4>
                                <p className={`text-sm ${themeClasses.textSecondary}`}>
                                    Establishing secure connection with device.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center text-center py-8 space-y-6">
                            <div className="bg-green-500 p-4 rounded-full shadow-lg shadow-green-500/30">
                                <CheckCircle className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h4 className={`text-xl font-bold mb-2 ${themeClasses.text}`}>Device Paired!</h4>
                                <p className={`text-sm ${themeClasses.textSecondary}`}>
                                    Your NeuroGlass Air is now connected and ready to use.
                                </p>
                            </div>
                            <div className={`w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border ${themeClasses.border} text-left`}>
                                <div className="flex items-center space-x-3 mb-2">
                                    <Smartphone className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                                    <span className={`font-medium ${themeClasses.text}`}>NeuroGlass Air</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className={themeClasses.textSecondary}>Battery</span>
                                    <span className="text-green-500 font-medium">100%</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'failed' && (
                        <div className="flex flex-col items-center text-center py-8 space-y-6">
                            <div className="bg-red-500 p-4 rounded-full shadow-lg shadow-red-500/30">
                                <AlertCircle className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h4 className={`text-xl font-bold mb-2 ${themeClasses.text}`}>Pairing Failed</h4>
                                <p className={`text-sm ${themeClasses.textSecondary}`}>
                                    Could not connect to device. Please try again.
                                </p>
                            </div>
                            <button
                                onClick={() => setStep('scan')}
                                className={`px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 ${themeClasses.text} font-medium hover:opacity-90`}
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
