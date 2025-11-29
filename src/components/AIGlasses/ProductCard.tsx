import React from 'react';
import { Star, Battery, Cpu, Camera } from 'lucide-react';
import { Product } from '../../types';
import { getThemeClasses } from '../../utils/themeUtils';

interface ProductCardProps {
    product: Product;
    theme: 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'indigo' | 'teal';
    onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, theme, onViewDetails }: ProductCardProps) {
    const themeClasses = getThemeClasses(theme);

    return (
        <div className={`${themeClasses.surfaceSecondary} rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border ${themeClasses.border}`}>
            <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" />
                    {product.rating}
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-lg font-bold ${themeClasses.text}`}>{product.name}</h3>
                    <span className={`text-lg font-bold ${themeClasses.primaryText}`}>${product.price}</span>
                </div>

                <p className={`text-sm ${themeClasses.textSecondary} mb-4 line-clamp-2`}>
                    {product.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center" title="Battery Life">
                        <Battery className="w-3 h-3 mr-1" />
                        {product.specs.battery}
                    </div>
                    <div className="flex items-center" title="Processor">
                        <Cpu className="w-3 h-3 mr-1" />
                        {product.specs.processor}
                    </div>
                    <div className="flex items-center" title="Camera">
                        <Camera className="w-3 h-3 mr-1" />
                        {product.specs.camera}
                    </div>
                </div>

                <button
                    onClick={() => onViewDetails(product)}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${themeClasses.primary} text-white shadow-md hover:opacity-90`}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
