export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date;
  estimatedTime?: number; // in minutes
  tags?: string[];
  category?: string;
  createdAt: Date;
  isAIGenerated?: boolean;
}

export interface Email {
  id: string;
  sender: string;
  subject: string;
  summary: string;
  content?: string;
  priority: 'high' | 'medium' | 'low';
  suggestedReply?: string;
  timestamp: Date;
  isRead: boolean;
  domain?: string;
  isExpanded?: boolean;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface WellnessNudge {
  id: string;
  type: 'break' | 'breathing' | 'hydration' | 'posture' | 'motivation';
  title: string;
  description: string;
  action?: string;
  timestamp: Date;
  autoDismiss?: boolean;
}

export interface FocusSession {
  id: string;
  startTime: Date;
  duration: number; // in minutes
  isActive: boolean;
  remainingTime?: number;
}

export interface DailyPlan {
  date: Date;
  focusBlocks: {
    startTime: string;
    endTime: string;
    title: string;
    type: 'work' | 'break' | 'meeting';
  }[];
  keyTasks: Task[];
  estimatedProductivity: number; // 0-100
}

export type Theme = 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'indigo' | 'teal';
export type Mode = 'focus' | 'relax';