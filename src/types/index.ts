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
  recurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly';
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
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedAction?: {
    type: 'schedule_meeting' | 'create_task' | 'send_email' | 'update_task' | 'other';
    status: 'proposed' | 'approved' | 'denied' | 'completed';
    data?: any;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'archived';
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
export type AppMode = 'focus' | 'relax';

export interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  duration: number; // in minutes
  participants: string[];
  status: 'scheduled' | 'live' | 'completed';
  summary?: {
    keyPoints: string[];
    actionItems: string[];
  };
  recordingUrl?: string;
  platform: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: number; // points
  type: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'completed' | 'claimed';
  startDate: Date;
  endDate: Date;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  type: 'voucher' | 'discount' | 'cashback';
  code?: string;
  isRedeemed: boolean;
  icon?: string;
  description: string;
  category: string;
  imageUrl?: string;
}

export interface UserHistory {
  date: string; // ISO date string YYYY-MM-DD
  score: number;
  tasksCompleted: number;
}

export interface GlassDevice {
  id: string;
  name: string;
  model: string;
  status: 'connected' | 'disconnected' | 'pairing' | 'syncing';
  batteryLevel: number;
  lastSynced: Date;
  firmwareVersion: string;
  serialNumber: string;
  settings?: {
    autoLock: boolean;
    notificationsEnabled: boolean;
    voiceActivation: boolean;
    gestureControl: boolean;
  };
}

export interface VirtualCard {
  id: string;
  label: string;
  cardNumber: string; // Last 4 digits for display
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  balance: number;
  status: 'active' | 'frozen';
  spendingLimit: number; // Daily limit
  spentToday: number;
  glassDeviceId: string; // Linked to specific glasses
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'declined';
  category: string;
  description: string;
  glassDeviceId: string;
  virtualCardId: string;
}

export interface VoiceCommand {
  id: string;
  phrase: string;
  description: string;
  action: string;
}

export interface VoiceCommandLog {
  id: string;
  transcript: string;
  actionType: 'meeting' | 'task' | 'email' | 'payment' | 'query' | 'other';
  timestamp: Date;
  status: 'executed' | 'failed' | 'processing';
  deviceId: string;
  result?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  specs: {
    battery: string;
    camera: string;
    processor: string;
    weight: string;
    aiModel: string;
  };
  image: string;
  rating: number;
  reviews: number;
  features: string[];
}