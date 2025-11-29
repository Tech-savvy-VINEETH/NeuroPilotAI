import React, { useState, useEffect } from 'react';
import { ShoppingBag, Glasses, CreditCard, Activity, Plus, Mic } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getThemeClasses } from '../utils/themeUtils';
import { Product, GlassDevice, VoiceCommand, VoiceCommandLog, VirtualCard, Transaction } from '../types';
import { ProductCard } from '../components/AIGlasses/ProductCard';
import { ProductDetails } from '../components/AIGlasses/ProductDetails';
import { PurchaseModal } from '../components/AIGlasses/PurchaseModal';
import { DeviceCard } from '../components/AIGlasses/DeviceCard';
import { PairingWizard } from '../components/AIGlasses/PairingWizard';
import { CommandHistory } from '../components/AIGlasses/CommandHistory';
import { VoiceVisualizer } from '../components/AIGlasses/VoiceVisualizer';
import { VirtualCardDisplay } from '../components/AIGlasses/VirtualCardDisplay';
import { TransactionList } from '../components/AIGlasses/TransactionList';
import { SpendingChart } from '../components/AIGlasses/SpendingChart';

// Mock Products
const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'NeuroGlass Air',
        price: 299.00,
        description: 'Ultra-lightweight smart glasses with all-day comfort. Features advanced AR overlay, voice assistant, and health tracking.',
        specs: {
            battery: '18 hours',
            camera: '12MP Ultra-wide',
            processor: 'NeuroChip X1',
            weight: '42g',
            aiModel: 'Gemini Nano'
        },
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
        rating: 4.8,
        reviews: 124,
        features: ['Real-time Translation', 'Health Monitoring', 'Navigation Overlay', 'Voice Control']
    },
    {
        id: '2',
        name: 'NeuroGlass Pro',
        price: 499.00,
        description: 'Professional grade AR glasses designed for productivity. Includes multiple virtual monitors, advanced noise cancellation, and enterprise security.',
        specs: {
            battery: '12 hours',
            camera: '48MP Pro System',
            processor: 'NeuroChip X1 Pro',
            weight: '58g',
            aiModel: 'Gemini Pro'
        },
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
        rating: 4.9,
        reviews: 89,
        features: ['Virtual Monitors', 'Spatial Audio', 'Enterprise Security', 'Gesture Control']
    },
    {
        id: '3',
        name: 'NeuroGlass Sport',
        price: 349.00,
        description: 'Rugged smart glasses for athletes. Water-resistant, impact protection, and specialized coaching AI for various sports.',
        specs: {
            battery: '24 hours',
            camera: 'Action Cam 4K',
            processor: 'NeuroChip S1',
            weight: '45g',
            aiModel: 'Gemini Sport'
        },
        image: '/images/neuroglass-sport.png',
        rating: 4.7,
        reviews: 215,
        features: ['Biometric Tracking', 'Coaching AI', 'Water Resistant', 'GPS Tracking']
    }
];

// Mock Devices
const MOCK_DEVICES: GlassDevice[] = [
    {
        id: 'd1',
        name: 'My NeuroGlass Air',
        model: 'NeuroGlass Air',
        serialNumber: 'NG-AIR-2024-001',
        firmwareVersion: '2.1.0',
        batteryLevel: 85,
        status: 'connected',
        lastSynced: new Date(),
        settings: {
            autoLock: true,
            notificationsEnabled: true,
            voiceActivation: true,
            gestureControl: true
        }
    }
];

// Mock Voice Commands
const MOCK_COMMANDS: VoiceCommandLog[] = [
    {
        id: 'c1',
        transcript: "Schedule a meeting with Sarah for tomorrow at 2 PM",
        actionType: 'meeting',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        status: 'executed',
        deviceId: 'd1',
        result: "Meeting scheduled: 'Sync with Sarah' tomorrow at 2:00 PM"
    },
    {
        id: 'c2',
        transcript: "Remind me to buy milk",
        actionType: 'task',
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        status: 'executed',
        deviceId: 'd1',
        result: "Task added: 'Buy milk' - High Priority"
    },
    {
        id: 'c3',
        transcript: "What's my battery level?",
        actionType: 'query',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        status: 'executed',
        deviceId: 'd1',
        result: "Battery level is 85%"
    }
];

// Mock Wallet Data
const MOCK_CARD: VirtualCard = {
    id: 'vc1',
    cardNumber: '•••• •••• •••• 4242',
    cardHolder: 'ALEX MORGAN',
    expiryDate: '12/28',
    cvv: '•••',
    balance: 2450.00,
    status: 'active',
    spendingLimit: 5000,
    spentToday: 124.50,
    glassDeviceId: 'd1',
    label: 'Personal Card'
};

const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 't1',
        merchant: 'Starbucks Coffee',
        amount: 12.50,
        date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: 'completed',
        category: 'food',
        glassDeviceId: 'd1',
        virtualCardId: 'vc1',
        description: 'Coffee',
        specs: {
            battery: '',
            camera: '',
            processor: '',
            weight: '',
            aiModel: ''
        },
        image: '',
        rating: 0,
        reviews: 0,
        features: []
    },
    {
        id: 't2',
        merchant: 'Uber Ride',
        amount: 24.00,
        date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        status: 'completed',
        category: 'transport',
        glassDeviceId: 'd1',
        virtualCardId: 'vc1',
        description: 'Ride to office',
        specs: {
            battery: '',
            camera: '',
            processor: '',
            weight: '',
            aiModel: ''
        },
        image: '',
        rating: 0,
        reviews: 0,
        features: []
    },
    {
        id: 't3',
        merchant: 'Apple Store',
        amount: 89.99,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        status: 'completed',
        category: 'shopping',
        glassDeviceId: 'd1',
        virtualCardId: 'vc1',
        description: 'Accessories',
        specs: {
            battery: '',
            camera: '',
            processor: '',
            weight: '',
            aiModel: ''
        },
        image: '',
        rating: 0,
        reviews: 0,
        features: []
    }
];

const SPENDING_DATA = [
    { label: 'Shopping', amount: 450, color: 'bg-blue-500' },
    { label: 'Food', amount: 320, color: 'bg-orange-500' },
    { label: 'Transport', amount: 180, color: 'bg-green-500' },
    { label: 'Services', amount: 240, color: 'bg-purple-500' }
];

export function AIGlasses() {
    const { state } = useApp();
    const themeClasses = getThemeClasses(state.theme);
    const [activeTab, setActiveTab] = useState<'store' | 'devices' | 'wallet' | 'activity'>('store');

    // Store State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    // Device State
    const [devices, setDevices] = useState<GlassDevice[]>(MOCK_DEVICES);
    const [showPairingWizard, setShowPairingWizard] = useState(false);

    // Voice State
    const [commands, setCommands] = useState<VoiceCommandLog[]>(MOCK_COMMANDS);
    const [isListening, setIsListening] = useState(false);

    // Wallet State
    const [virtualCard, setVirtualCard] = useState<VirtualCard>(MOCK_CARD);

    const tabs = [
        { id: 'store', label: 'Product Store', icon: ShoppingBag },
        { id: 'devices', label: 'My Glasses', icon: Glasses },
        { id: 'wallet', label: 'Smart Wallet', icon: CreditCard },
        { id: 'activity', label: 'Voice History', icon: Activity }
    ];

    // Store Handlers
    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleBuy = (product: Product) => {
        setSelectedProduct(product);
        setShowPurchaseModal(true);
    };

    const handleCloseDetails = () => {
        if (!showPurchaseModal) {
            setSelectedProduct(null);
        }
    };

    const handleClosePurchase = () => {
        setShowPurchaseModal(false);
    };

    const handleConfirmPurchase = () => {
        setShowPurchaseModal(false);
        setSelectedProduct(null);
    };

    // Device Handlers
    const handleDisconnect = (deviceId: string) => {
        setDevices(prev => prev.map(d =>
            d.id === deviceId ? { ...d, status: 'disconnected' } : d
        ));
    };

    const handleSync = (deviceId: string) => {
        setDevices(prev => prev.map(d =>
            d.id === deviceId ? { ...d, status: 'syncing' } : d
        ));
        setTimeout(() => {
            setDevices(prev => prev.map(d =>
                d.id === deviceId ? { ...d, status: 'connected', lastSynced: new Date() } : d
            ));
        }, 2000);
    };

    const handlePairDevice = (deviceName: string) => {
        const newDevice: GlassDevice = {
            id: `d${Date.now()}`,
            name: deviceName,
            model: 'NeuroGlass Air', // Mock model
            serialNumber: `NG-${Date.now()}`,
            firmwareVersion: '1.0.0',
            batteryLevel: 100,
            status: 'connected',
            lastSynced: new Date(),
            settings: {
                autoLock: true,
                notificationsEnabled: true,
                voiceActivation: true,
                gestureControl: true
            }
        };
        setDevices(prev => [...prev, newDevice]);
        setShowPairingWizard(false);
    };

    // Voice Handlers
    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            // Simulate processing a command
            const newCommand: VoiceCommandLog = {
                id: `c${Date.now()}`,
                transcript: "Show me my daily summary",
                actionType: 'query',
                timestamp: new Date(),
                status: 'processing',
                deviceId: 'd1'
            };
            setCommands(prev => [newCommand, ...prev]);

            setTimeout(() => {
                setCommands(prev => prev.map(c =>
                    c.id === newCommand.id
                        ? { ...c, status: 'executed', result: "Here is your daily summary: 3 meetings, 5 tasks pending." }
                        : c
                ));
            }, 2000);
        } else {
            setIsListening(true);
        }
    };

    // Wallet Handlers
    const toggleCardFreeze = () => {
        setVirtualCard(prev => ({
            ...prev,
            status: prev.status === 'active' ? 'frozen' : 'active'
        }));
    };

    return (
        <div className={`h-full flex flex-col ${themeClasses.surface} ${themeClasses.text}`}>
            {/* Header */}
            <div className={`p-6 border-b ${themeClasses.border}`}>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">NeuroPilot AI Glasses</h1>
                        <p className={themeClasses.textSecondary}>
                            Manage your connected devices, voice commands, and smart payments
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className={`px-4 py-2 rounded-lg ${themeClasses.surfaceSecondary} flex items-center space-x-2`}>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium">System Online</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                                    ? `${themeClasses.primary} text-white shadow-md`
                                    : `${themeClasses.textSecondary} hover:bg-gray-100 dark:hover:bg-gray-800`
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'store' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-4">Experience the Future</h2>
                            <p className={`text-lg ${themeClasses.textSecondary} max-w-2xl mx-auto`}>
                                Discover our range of AI-powered smart glasses designed to enhance your productivity, health, and daily life.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {MOCK_PRODUCTS.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    theme={state.theme}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'devices' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Connected Devices</h2>
                                <p className={themeClasses.textSecondary}>Manage your paired AI Glasses.</p>
                            </div>
                            <button
                                onClick={() => setShowPairingWizard(true)}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${themeClasses.primary} text-white shadow-lg`}
                            >
                                <Plus className="w-5 h-5" />
                                <span>Pair New Device</span>
                            </button>
                        </div>

                        <div className="grid gap-6">
                            {devices.map(device => (
                                <DeviceCard
                                    key={device.id}
                                    device={device}
                                    theme={state.theme}
                                    onDisconnect={handleDisconnect}
                                    onSync={handleSync}
                                />
                            ))}

                            {devices.length === 0 && (
                                <div className={`text-center py-16 rounded-2xl border-2 border-dashed ${themeClasses.border}`}>
                                    <Glasses className={`w-16 h-16 mx-auto mb-4 ${themeClasses.textSecondary} opacity-50`} />
                                    <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>No Devices Connected</h3>
                                    <p className={themeClasses.textSecondary}>Pair your AI Glasses to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'wallet' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <VirtualCardDisplay
                                card={virtualCard}
                                theme={state.theme}
                                onToggleFreeze={toggleCardFreeze}
                            />
                            <SpendingChart
                                data={SPENDING_DATA}
                                theme={state.theme}
                            />
                        </div>
                        <TransactionList
                            transactions={MOCK_TRANSACTIONS}
                            theme={state.theme}
                        />
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Voice Command History</h2>
                                <p className={themeClasses.textSecondary}>View and analyze your voice interactions.</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <VoiceVisualizer isActive={isListening} theme={state.theme} />
                                <button
                                    onClick={toggleListening}
                                    className={`p-4 rounded-full transition-all transform hover:scale-110 shadow-lg ${isListening
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : `${themeClasses.primary} text-white`
                                        }`}
                                >
                                    <Mic className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <CommandHistory commands={commands} theme={state.theme} />
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedProduct && !showPurchaseModal && (
                <ProductDetails
                    product={selectedProduct}
                    theme={state.theme}
                    onClose={handleCloseDetails}
                    onBuy={handleBuy}
                />
            )}

            {selectedProduct && showPurchaseModal && (
                <PurchaseModal
                    product={selectedProduct}
                    theme={state.theme}
                    onClose={handleClosePurchase}
                    onConfirm={handleConfirmPurchase}
                />
            )}

            {showPairingWizard && (
                <PairingWizard
                    theme={state.theme}
                    onClose={() => setShowPairingWizard(false)}
                    onPair={handlePairDevice}
                />
            )}
        </div>
    );
}
