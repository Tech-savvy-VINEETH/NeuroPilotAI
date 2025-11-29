import React from 'react';
import { Clock, CheckCircle, XCircle, Loader, MessageSquare, Mic } from 'lucide-react';
import { VoiceCommandLog } from '../../types';
import { getThemeClasses } from '../../utils/themeUtils';

interface CommandHistoryProps {
    commands: VoiceCommandLog[];
    theme: 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'indigo' | 'teal';
}

export function CommandHistory({ commands, theme }: CommandHistoryProps) {
    const themeClasses = getThemeClasses(theme);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'executed': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'processing': return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
            default: return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    const getActionColor = (type: string) => {
        switch (type) {
            case 'meeting': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
            case 'task': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'email': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            case 'payment': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="space-y-4">
            {commands.map((command) => (
                <div
                    key={command.id}
                    className={`${themeClasses.surface} p-4 rounded-xl border ${themeClasses.border} transition-all hover:shadow-md`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${themeClasses.surfaceSecondary}`}>
                                <Mic className={`w-4 h-4 ${themeClasses.primaryText}`} />
                            </div>
                            <div>
                                <p className={`font-medium ${themeClasses.text}`}>"{command.transcript}"</p>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>
                                    {new Date(command.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase ${getActionColor(command.actionType)}`}>
                                {command.actionType}
                            </span>
                            {getStatusIcon(command.status)}
                        </div>
                    </div>

                    {command.result && (
                        <div className={`ml-11 mt-2 p-3 rounded-lg ${themeClasses.surfaceSecondary} text-sm ${themeClasses.textSecondary} flex items-start space-x-2`}>
                            <MessageSquare className="w-4 h-4 mt-0.5 opacity-70" />
                            <span>{command.result}</span>
                        </div>
                    )}
                </div>
            ))}

            {commands.length === 0 && (
                <div className={`text-center py-12 ${themeClasses.textSecondary}`}>
                    <Mic className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No voice commands yet</p>
                </div>
            )}
        </div>
    );
}
