import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, MoreVertical, MessageSquare, Users, Circle } from 'lucide-react';
import { Meeting } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface MeetingRoomProps {
    meeting: Meeting;
    onEnd: () => void;
}

export function MeetingRoom({ meeting, onEnd }: MeetingRoomProps) {
    const { state } = useApp();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const participants = [
        { name: 'You', isMuted: isMuted, isVideoOff: isVideoOff, isSpeaking: false },
        ...meeting.participants.filter(p => p !== 'You').map(name => ({
            name,
            isMuted: Math.random() > 0.8,
            isVideoOff: Math.random() > 0.9,
            isSpeaking: Math.random() > 0.7
        }))
    ];

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <div className="h-16 px-6 flex items-center justify-between bg-gray-900 border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <h2 className="font-semibold text-lg">{meeting.title}</h2>
                    <span className="bg-gray-800 px-2 py-1 rounded text-xs font-mono text-gray-400">
                        {formatTime(elapsedTime)}
                    </span>
                    {isRecording && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs font-medium animate-pulse">
                            <Circle className="w-2 h-2 fill-current" />
                            REC
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                        <Users className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                        <MessageSquare className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content (Grid) */}
            <div className="flex-1 p-4 overflow-hidden">
                <div className={`grid gap-4 h-full ${participants.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'
                    }`}>
                    {participants.map((participant, index) => (
                        <div key={index} className="relative bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center group">
                            {participant.isVideoOff ? (
                                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-400">
                                    {participant.name.charAt(0)}
                                </div>
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-800 animate-pulse opacity-10"></div>
                                // In a real app, video stream would go here
                            )}

                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                <span className="bg-black/50 px-2 py-1 rounded text-sm font-medium backdrop-blur-sm">
                                    {participant.name}
                                </span>
                                {participant.isMuted && (
                                    <div className="bg-red-500 p-1 rounded-full">
                                        <MicOff className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>

                            {participant.isSpeaking && !participant.isMuted && (
                                <div className="absolute inset-0 border-2 border-green-500 rounded-xl pointer-events-none"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Controls */}
            <div className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-center gap-4">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-4 rounded-full transition-colors ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                >
                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </button>

                <button
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`p-4 rounded-full transition-colors ${isScreenSharing ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                >
                    <Monitor className="w-6 h-6" />
                </button>

                <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-4 rounded-full transition-colors ${isRecording ? 'bg-gray-700 text-red-500 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                    title="Record Meeting"
                >
                    <Circle className={`w-6 h-6 ${isRecording ? 'fill-current' : ''}`} />
                </button>

                <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                    <MoreVertical className="w-6 h-6" />
                </button>

                <button
                    onClick={onEnd}
                    className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors ml-4 flex items-center gap-2"
                >
                    <PhoneOff className="w-6 h-6" />
                    End Call
                </button>
            </div>
        </div>
    );
}
