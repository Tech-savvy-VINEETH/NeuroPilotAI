import React, { useState, useEffect } from 'react';
import { X, Bluetooth, Search, CheckCircle, Smartphone, Loader } from 'lucide-react';
import { getThemeClasses } from '../../utils/themeUtils';

interface PairingWizardProps {
    theme: 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'indigo' | 'teal';
    onClose: () => void;
    onPair: (deviceName: string) => void;
}

export function PairingWizard({ theme, onClose, onPair }: PairingWizardProps) {
    const themeClasses = getThemeClasses(theme);
    const [step, setStep] = useState<'scanning' | 'found' | 'pairing' | 'success'>('scanning');
    const [foundDevice, setFoundDevice] = useState<string | null>(null);

    useEffect(() => {
        if (step === 'scanning') {
            const timer = setTimeout(() => {
                setFoundDevice('NeuroGlass Air (New)');
                setStep('found');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handlePair = () => {
        setStep('pairing');
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                if (foundDevice) {
                    onPair(foundDevice);
                }
            }, 2000);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`${themeClasses.surface} w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border ${themeClasses.border}`}>
                <div className={`p-6 border-b ${themeClasses.border} flex justify-between items-center`}>
                    <h3 className={`text-xl font-bold ${themeClasses.text}`}>Pair New Device</h3>
                    <button onClick={onClose} className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${themeClasses.textSecondary}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 text-center">
                    {step === 'scanning' && (
                        <>
                            <div className="relative w-24 h-24 mx-auto mb-8">
                                <div className={`absolute inset-0 rounded-full ${themeClasses.primary} opacity-20 animate-ping`} />
                                <div className={`absolute inset-2 rounded-full ${themeClasses.primary} opacity-40 animate-ping animation-delay-500`} />
                                <div className={`absolute inset-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 border-2 ${themeClasses.border}`}>
                                    <Search className={`w-10 h-10 ${themeClasses.primaryText}`} />
                                </div>
                            </div>
                            <h4 className={`text-lg font-bold ${themeClasses.text} mb-2`}>Scanning for devices...</h4>
                            <p className={themeClasses.textSecondary}>Make sure your glasses are in pairing mode.</p>
                        </>
                    )}

                    {step === 'found' && (
                        <>
                            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Bluetooth className="w-10 h-10 text-green-500" />
                            </div>
                            <h4 className={`text-lg font-bold ${themeClasses.text} mb-2`}>Device Found!</h4>
                            <div className={`p-4 rounded-xl ${themeClasses.surfaceSecondary} mb-6 border ${themeClasses.border}`}>
                                <div className="flex items-center space-x-3">
                                    <Smartphone className={themeClasses.textSecondary} />
                                    <span className={`font-medium ${themeClasses.text}`}>{foundDevice}</span>
                                </div>
                            </div>
                            <button
                                onClick={handlePair}
                                className={`w-full py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${themeClasses.primary} text-white shadow-lg`}
                            >
                                Connect Device
                            </button>
                        </>
                    )}

                    {step === 'pairing' && (
                        <>
                            <Loader className={`w-16 h-16 mx-auto mb-6 animate-spin ${themeClasses.primaryText}`} />
                            <h4 className={`text-lg font-bold ${themeClasses.text} mb-2`}>Pairing...</h4>
                            <p className={themeClasses.textSecondary}>Establishing secure connection.</p>
                        </>
                    )}

                    {step === 'success' && (
                        <>
                            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                            <h4 className={`text-lg font-bold ${themeClasses.text} mb-2`}>Connected!</h4>
                            <p className={themeClasses.textSecondary}>Your device is ready to use.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
