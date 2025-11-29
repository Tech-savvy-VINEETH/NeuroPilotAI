import React from 'react';
import { CreditCard, Wifi, Lock, Unlock } from 'lucide-react';
import { VirtualCard } from '../../types';
import { getThemeClasses } from '../../utils/themeUtils';

interface VirtualCardDisplayProps {
    card: VirtualCard;
    theme: 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'indigo' | 'teal';
    onToggleFreeze: (cardId: string) => void;
}

export function VirtualCardDisplay({ card, theme, onToggleFreeze }: VirtualCardDisplayProps) {
    const themeClasses = getThemeClasses(theme);

    return (
        <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-all transform hover:scale-105 ${card.status === 'frozen' ? 'bg-gray-600' : 'bg-gradient-to-br from-purple-600 to-blue-600'
            }`}>
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black opacity-10 rounded-full blur-xl" />

            <div className="relative z-10 flex flex-col h-full justify-between min-h-[200px]">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                        <CreditCard className="w-8 h-8" />
                        <span className="font-bold text-lg tracking-wider">NeuroPay</span>
                    </div>
                    <Wifi className="w-6 h-6 transform rotate-90 opacity-80" />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <span className="font-mono text-xl tracking-widest">{card.cardNumber}</span>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs opacity-70 uppercase mb-1">Card Holder</p>
                            <p className="font-medium tracking-wide">{card.cardHolder}</p>
                        </div>
                        <div>
                            <p className="text-xs opacity-70 uppercase mb-1">Expires</p>
                            <p className="font-medium tracking-wide">{card.expiryDate}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Freeze Overlay */}
            {card.status === 'frozen' && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="text-center">
                        <Lock className="w-12 h-12 mx-auto mb-2 opacity-80" />
                        <p className="font-bold text-lg">CARD FROZEN</p>
                    </div>
                </div>
            )}

            {/* Controls */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFreeze(card.id);
                }}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-md"
                title={card.status === 'frozen' ? "Unfreeze Card" : "Freeze Card"}
            >
                {card.status === 'frozen' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>
        </div>
    );
}
