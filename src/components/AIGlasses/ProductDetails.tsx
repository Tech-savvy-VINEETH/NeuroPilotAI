import React from 'react';
import { X, Star, Battery, Cpu, Camera, Weight, Brain, Check } from 'lucide-react';
import { Product } from '../../types';
import { getThemeClasses } from '../../utils/themeUtils';

interface ProductDetailsProps {
    product: Product;
    theme: 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'indigo' | 'teal';
    onClose: () => void;
    onBuy: (product: Product) => void;
}

export function ProductDetails({ product, theme, onClose, onBuy }: ProductDetailsProps) {
    const themeClasses = getThemeClasses(theme);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`${themeClasses.surface} w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]`}>

                {/* Image Section */}
                <div className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-800 relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 md:hidden"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>{product.name}</h2>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center text-yellow-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className={`ml-1 font-bold ${themeClasses.text}`}>{product.rating}</span>
                                </div>
                                <span className={themeClasses.textSecondary}>({product.reviews} reviews)</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hidden md:block ${themeClasses.textSecondary}`}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className={`text-3xl font-bold ${themeClasses.primaryText} mb-6`}>
                        ${product.price}
                    </div>

                    <p className={`${themeClasses.textSecondary} mb-8 leading-relaxed`}>
                        {product.description}
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className={`p-3 rounded-lg ${themeClasses.surfaceSecondary} flex items-center space-x-3`}>
                            <Battery className={`w-5 h-5 ${themeClasses.primaryText}`} />
                            <div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>Battery</p>
                                <p className={`font-semibold ${themeClasses.text}`}>{product.specs.battery}</p>
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg ${themeClasses.surfaceSecondary} flex items-center space-x-3`}>
                            <Cpu className={`w-5 h-5 ${themeClasses.primaryText}`} />
                            <div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>Processor</p>
                                <p className={`font-semibold ${themeClasses.text}`}>{product.specs.processor}</p>
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg ${themeClasses.surfaceSecondary} flex items-center space-x-3`}>
                            <Camera className={`w-5 h-5 ${themeClasses.primaryText}`} />
                            <div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>Camera</p>
                                <p className={`font-semibold ${themeClasses.text}`}>{product.specs.camera}</p>
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg ${themeClasses.surfaceSecondary} flex items-center space-x-3`}>
                            <Weight className={`w-5 h-5 ${themeClasses.primaryText}`} />
                            <div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>Weight</p>
                                <p className={`font-semibold ${themeClasses.text}`}>{product.specs.weight}</p>
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg ${themeClasses.surfaceSecondary} flex items-center space-x-3 col-span-2`}>
                            <Brain className={`w-5 h-5 ${themeClasses.primaryText}`} />
                            <div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>AI Model</p>
                                <p className={`font-semibold ${themeClasses.text}`}>{product.specs.aiModel}</p>
                            </div>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="mb-8">
                        <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Key Features</h3>
                        <ul className="space-y-2">
                            {product.features.map((feature, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                    <Check className={`w-5 h-5 ${themeClasses.primaryText} mt-0.5 flex-shrink-0`} />
                                    <span className={themeClasses.textSecondary}>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 flex space-x-4">
                        <button
                            onClick={() => onBuy(product)}
                            className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${themeClasses.primary} text-white shadow-lg`}
                        >
                            Buy Now
                        </button>
                        <button
                            onClick={onClose}
                            className={`px-6 py-3 rounded-xl font-semibold border ${themeClasses.border} ${themeClasses.text} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
