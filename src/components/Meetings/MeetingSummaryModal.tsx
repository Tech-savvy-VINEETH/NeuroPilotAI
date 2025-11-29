import React from 'react';
import { X, FileText, CheckCircle2, List, Download, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Meeting } from '../../types';
import { cn } from '../../lib/utils';

interface MeetingSummaryModalProps {
    meeting: Meeting | null;
    isOpen: boolean;
    onClose: () => void;
}

export function MeetingSummaryModal({ meeting, isOpen, onClose }: MeetingSummaryModalProps) {
    if (!meeting || !meeting.summary) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <Card className="w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col pointer-events-auto bg-[var(--bg-primary)] border-[var(--border-color)] shadow-2xl">
                            {/* Header */}
                            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <FileText className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <h2 className="text-xl font-bold text-[var(--text-primary)]">AI Meeting Summary</h2>
                                    </div>
                                    <h3 className="text-lg font-medium text-[var(--text-secondary)]">{meeting.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)] opacity-70">
                                        {new Date(meeting.startTime).toLocaleDateString()} • {new Date(meeting.startTime).toLocaleTimeString()}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Key Points */}
                                <section>
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                                        <List className="w-4 h-4" />
                                        Key Discussion Points
                                    </h4>
                                    <div className="space-y-3">
                                        {meeting.summary.keyPoints.map((point, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="p-3 rounded-lg bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] text-[var(--text-primary)]"
                                            >
                                                {point}
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>

                                {/* Action Items */}
                                <section>
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Action Items
                                    </h4>
                                    <div className="space-y-3">
                                        {meeting.summary.actionItems.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + (index * 0.1) }}
                                                className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20"
                                            >
                                                <div className="mt-0.5">
                                                    <div className="w-4 h-4 rounded border border-green-500/50 flex items-center justify-center">
                                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                    </div>
                                                </div>
                                                <span className="text-[var(--text-primary)]">{item}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/30 flex justify-end gap-3">
                                <Button variant="outline" className="gap-2">
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </Button>
                                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                    <Download className="w-4 h-4" />
                                    Export to PDF
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
