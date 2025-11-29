import React, { useState } from 'react';
import { X, CreditCard, CheckCircle, Loader } from 'lucide-react';
import { Product } from '../../types';
import { getThemeClasses } from '../../utils/themeUtils';

interface PurchaseModalProps {
    product: Product;
    theme: 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'indigo' | 'teal';
    onClose: () => void;
    onConfirm: () => void;
}

export function PurchaseModal({ product, theme, onClose, onConfirm }: PurchaseModalProps) {
    const themeClasses = getThemeClasses(theme);
    const [step, setStep] = useState<'review' | 'processing' | 'success'>('review');

    const handlePurchase = () => {
        setStep('processing');
        // Simulate payment processing
        setTimeout(() => {
            setStep('success');
            // Close after success message
            setTimeout(() => {
                onConfirm();
            }, 2000);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`${themeClasses.surface} w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border ${themeClasses.border}`}>

                {step === 'review' && (
                    <>
                        <div className={`p-6 border-b ${themeClasses.border} flex justify-between items-center`}>
                            <h3 className={`text-xl font-bold ${themeClasses.text}`}>Confirm Purchase</h3>
                            <button onClick={onClose} className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${themeClasses.textSecondary}`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                                <div>
                                    <h4 className={`font-bold ${themeClasses.text}`}>{product.name}</h4>
                                    <p className={themeClasses.textSecondary}>Quantity: 1</p>
                                </div>
                                <div className="ml-auto">
                                    <span className={`text-xl font-bold ${themeClasses.primaryText}`}>${product.price}</span>
                                </div>
                            </div>

                            <div className={`p-4 rounded-lg ${themeClasses.surfaceSecondary} mb-6`}>
                                <div className="flex justify-between mb-2">
                                    <span className={themeClasses.textSecondary}>Subtotal</span>
                                    <span className={themeClasses.text}>${product.price}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className={themeClasses.textSecondary}>Shipping</span>
                                    <span className="text-green-500 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className={themeClasses.textSecondary}>Tax (8%)</span>
                                    <span className={themeClasses.text}>${(product.price * 0.08).toFixed(2)}</span>
                                </div>
                                <div className={`border-t ${themeClasses.border} my-2 pt-2 flex justify-between font-bold text-lg`}>
                                    <span className={themeClasses.text}>Total</span>
                                    <span className={themeClasses.primaryText}>${(product.price * 1.08).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 mb-6 p-3 border border-blue-500/30 bg-blue-500/10 rounded-lg">
                                <CreditCard className="w-5 h-5 text-blue-500" />
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${themeClasses.text}`}>Visa ending in 4242</p>
                                    <p className="text-xs text-blue-500">Primary payment method</p>
                                </div>
                                <button className={`text-xs font-bold ${themeClasses.primaryText} hover:underline`}>Change</button>
                            </div>

                            <button
                                onClick={handlePurchase}
                                className={`w-full py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${themeClasses.primary} text-white shadow-lg`}
                            >
                                Pay ${(product.price * 1.08).toFixed(2)}
                            </button>
                        </div>
                    </>
                )}

                {step === 'processing' && (
                    <div className="p-12 text-center">
                        <Loader className={`w-16 h-16 mx-auto mb-6 animate-spin ${themeClasses.primaryText}`} />
                        <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>Processing Payment</h3>
                        <p className={themeClasses.textSecondary}>Please wait while we secure your transaction...</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>Purchase Successful!</h3>
                        <p className={themeClasses.textSecondary}>Your order has been confirmed. You will receive an email shortly.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
