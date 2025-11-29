import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, MoreVertical, X, Archive } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ChatSession } from '../../types';

export function ChatSidebar() {
    const { state, dispatch } = useApp();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const createNewChat = () => {
        const id = Date.now().toString();
        dispatch({
            type: 'CREATE_CHAT_SESSION',
            payload: { id, title: 'New Chat' }
        });
    };

    const deleteChat = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this chat?')) {
            dispatch({ type: 'DELETE_CHAT_SESSION', payload: id });
        }
    };

    const startEditing = (e: React.MouseEvent, session: ChatSession) => {
        e.stopPropagation();
        setEditingId(session.id);
        setEditTitle(session.title);
    };

    const saveTitle = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId && editTitle.trim()) {
            dispatch({
                type: 'RENAME_CHAT_SESSION',
                payload: { id: editingId, title: editTitle.trim() }
            });
            setEditingId(null);
        }
    };

    return (
        <div className="w-64 bg-[var(--bg-secondary)]/50 backdrop-blur-xl border-r border-[var(--border-color)] flex flex-col h-full transition-colors duration-300">
            <div className="p-4 border-b border-[var(--border-color)]">
                <button
                    onClick={createNewChat}
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-xl transition-all shadow-lg shadow-teal-500/20"
                >
                    <Plus size={18} />
                    <span>New Chat</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {state.chatSessions.map((session) => (
                    <div
                        key={session.id}
                        onClick={() => dispatch({ type: 'SET_ACTIVE_CHAT_SESSION', payload: session.id })}
                        className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${state.activeChatSessionId === session.id
                            ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] border border-transparent'
                            }`}
                    >
                        <MessageSquare size={18} className="shrink-0" />

                        {editingId === session.id ? (
                            <form onSubmit={saveTitle} className="flex-1">
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onBlur={() => setEditingId(null)}
                                    autoFocus
                                    className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] px-2 py-1 rounded border border-teal-500 text-sm focus:outline-none"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </form>
                        ) : (
                            <span className="flex-1 truncate text-sm font-medium">{session.title}</span>
                        )}

                        <div className={`flex items-center gap-1 ${state.activeChatSessionId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                            <button
                                onClick={(e) => startEditing(e, session)}
                                className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)] hover:text-teal-500 transition-colors"
                                title="Rename"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                onClick={(e) => deleteChat(e, session.id)}
                                className="p-1.5 hover:bg-red-500/10 rounded-lg text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-[var(--border-color)] text-xs text-center text-[var(--text-secondary)]">
                {state.chatSessions.length} active chats
            </div>
        </div>
    );
}
