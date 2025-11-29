import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Coffee, Car, Zap } from 'lucide-react';
import { Transaction } from '../../types';
import { getThemeClasses } from '../../utils/themeUtils';

interface TransactionListProps {
    transactions: Transaction[];
    theme: 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'indigo' | 'teal';
}

export function TransactionList({ transactions, theme }: TransactionListProps) {
    const themeClasses = getThemeClasses(theme);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'shopping': return <ShoppingBag className="w-5 h-5 text-blue-500" />;
            case 'food': return <Coffee className="w-5 h-5 text-orange-500" />;
            case 'transport': return <Car className="w-5 h-5 text-green-500" />;
            default: return <Zap className="w-5 h-5 text-purple-500" />;
        }
    };

    return (
        <div className="space-y-4">
            <h3 className={`text-lg font-bold ${themeClasses.text} mb-4`}>Recent Transactions</h3>
            {transactions.map((transaction) => (
                <div
                    key={transaction.id}
                    className={`flex items-center justify-between p-4 rounded-xl ${themeClasses.surface} border ${themeClasses.border} transition-all hover:shadow-md`}
                >
                    <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${themeClasses.surfaceSecondary}`}>
                            {getCategoryIcon(transaction.category)}
                        </div>
                        <div>
                            <p className={`font-bold ${themeClasses.text}`}>{transaction.merchant}</p>
                            <p className={`text-sm ${themeClasses.textSecondary}`}>
                                {new Date(transaction.date).toLocaleDateString()} • {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`font-bold text-lg ${themeClasses.text}`}>
                            -${transaction.amount.toFixed(2)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                            {transaction.status}
                        </span>
                    </div>
                </div>
            ))}

            {transactions.length === 0 && (
                <div className={`text-center py-12 ${themeClasses.textSecondary}`}>
                    <p>No recent transactions</p>
                </div>
            )}
        </div>
    );
}
