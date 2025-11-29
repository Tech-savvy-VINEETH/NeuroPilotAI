import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  Task,
  Email,
  ChatMessage,
  WellnessNudge,
  Theme,
  AppMode,
  Meeting,
  Challenge,
  Reward,
  UserHistory,
  ChatSession,
  GlassDevice,
  VirtualCard,
  Transaction,
  VoiceCommand
} from '../types';
import { applyThemeToDocument } from '../utils/themeUtils';

interface AppState {
  theme: Theme;
  mode: AppMode;
  tasks: Task[];
  emails: Email[];
  meetings: Meeting[];
  chatMessages: ChatMessage[]; // Kept for backward compatibility, but will use chatSessions
  wellnessNudges: WellnessNudge[];
  challenges: Challenge[];
  rewards: Reward[];
  userHistory: UserHistory[];
  focusSession: {
    id: string;
    startTime: Date;
    duration: number; // in minutes
    isActive: boolean;
    remainingTime: number;
  } | null;
  isVoiceActive: boolean;
  activeView: string;
  selectedTags: string[];
  productivityScore: number;
  streak: number;
  totalCompleted: number;
  widgetOrder: string[];
  chatSessions: ChatSession[];
  activeChatSessionId: string | null;
  glassDevices: GlassDevice[];
  virtualCards: VirtualCard[];
  transactions: Transaction[];
  voiceCommands: VoiceCommand[];
}

type AppAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_MODE'; payload: AppMode }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_VOICE_ACTIVE'; payload: boolean }
  | { type: 'SET_ACTIVE_VIEW'; payload: string }
  | { type: 'DISMISS_NUDGE'; payload: string }
  | { type: 'MARK_EMAIL_READ'; payload: string }
  | { type: 'TOGGLE_EMAIL_EXPANDED'; payload: string }
  | { type: 'SET_SELECTED_TAGS'; payload: string[] }
  | { type: 'START_FOCUS_SESSION'; payload: { duration: number } }
  | { type: 'END_FOCUS_SESSION' }
  | { type: 'UPDATE_FOCUS_SESSION'; payload: { remainingTime: number } }
  | { type: 'UPDATE_PRODUCTIVITY_SCORE' }
  | { type: 'ADD_WELLNESS_NUDGE'; payload: WellnessNudge }
  | { type: 'SET_WIDGET_ORDER'; payload: string[] }
  | { type: 'UPDATE_CHALLENGE'; payload: { id: string; updates: Partial<Challenge> } }
  | { type: 'REDEEM_REWARD'; payload: string }
  | { type: 'CREATE_CHAT_SESSION'; payload: { id: string; title: string } }
  | { type: 'DELETE_CHAT_SESSION'; payload: string }
  | { type: 'RENAME_CHAT_SESSION'; payload: { id: string; title: string } }
  | { type: 'SET_ACTIVE_CHAT_SESSION'; payload: string }
  | { type: 'ADD_MESSAGE_TO_SESSION'; payload: { sessionId: string; message: ChatMessage } }
  | { type: 'SET_MEETINGS'; payload: Meeting[] }
  | { type: 'ADD_MEETING'; payload: Meeting }
  | { type: 'END_MEETING'; payload: { id: string; summary: any } }
  | { type: 'SET_CHALLENGES'; payload: Challenge[] }
  | { type: 'SET_REWARDS'; payload: Reward[] }
  | { type: 'UPDATE_USER_STATS'; payload: Partial<AppState> }
  | { type: 'UPDATE_CHALLENGE_PROGRESS'; payload: { id: string; progress: number } }
  | { type: 'ADD_DEVICE'; payload: GlassDevice }
  | { type: 'UPDATE_DEVICE_STATUS'; payload: { id: string; status: GlassDevice['status'] } }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_CARD_SETTINGS'; payload: { id: string; updates: Partial<VirtualCard> } }
  | { type: 'ADD_VOICE_COMMAND'; payload: VoiceCommand };

const initialState: AppState = {
  theme: 'dark', // Default to dark mode
  mode: 'focus',
  tasks: [
    {
      id: '1',
      title: 'Prepare Q1 investor pitch presentation',
      description: 'Create comprehensive presentation covering market analysis, competitive landscape, product roadmap, financial projections, and team overview for upcoming investor meetings',
      priority: 'high',
      status: 'in-progress',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      estimatedTime: 180,
      tags: ['presentation', 'investors', 'quarterly', 'strategy'],
      category: 'work',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isAIGenerated: false
    },
    {
      id: '2',
      title: 'Review and respond to client emails',
      description: 'Address pending inquiries from key clients, provide project updates, and schedule follow-up meetings as needed',
      priority: 'medium',
      status: 'pending',
      estimatedTime: 45,
      tags: ['communication', 'clients', 'follow-up'],
      category: 'communication',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isAIGenerated: false
    },
    {
      id: '3',
      title: 'Weekly team standup meeting',
      priority: 'medium',
      status: 'completed',
      estimatedTime: 30,
      tags: ['meeting', 'team', 'weekly'],
      category: 'work',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isAIGenerated: false
    },
    {
      id: '4',
      title: 'Market research for new product features',
      description: 'Analyze competitor offerings, user feedback, and market trends to identify opportunities for product enhancement',
      priority: 'high',
      status: 'pending',
      estimatedTime: 120,
      tags: ['research', 'product', 'market-analysis'],
      category: 'work',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isAIGenerated: true
    }
  ],
  emails: [
    {
      id: '1',
      sender: 'sarah.johnson@techcorp.com',
      subject: 'URGENT: Project Timeline Update Required - iOS Review Delays',
      summary: 'Sarah reports potential delays in iOS app review process that could impact launch timeline. Requests updated schedule and contingency planning discussion.',
      content: 'Hi there, I hope you\'re doing well. I wanted to reach out regarding the mobile app launch timeline. We\'ve encountered some potential delays in the iOS review process that might affect our original schedule. Apple has indicated that the review could take 2-3 additional weeks due to new privacy policy requirements. Could you please review the current timeline and send me an updated schedule? I think it would be beneficial to discuss contingency plans for the iOS review process and potentially consider a phased launch approach. Let me know when you\'re available for a call this week. This is quite urgent as we need to inform stakeholders by Friday. Thanks for your quick attention to this matter!',
      priority: 'high',
      suggestedReply: 'Hi Sarah, thanks for the urgent update. I\'ll review the timeline immediately and send you a revised schedule by EOD today. Let\'s schedule a call tomorrow morning to discuss contingency plans and the phased launch approach. I\'ll also prepare stakeholder communication for Friday.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
      domain: 'techcorp.com',
      isExpanded: false
    },
    {
      id: '2',
      sender: 'marketing@company.com',
      subject: 'Q4 Campaign Performance Report - Excellent Results!',
      summary: 'Q4 marketing campaigns exceeded expectations with 23% increase in conversion rates. Social media performed exceptionally well. Budget reallocation recommendations included.',
      content: 'Great news! Here\'s the Q4 marketing campaign performance report. We\'ve seen a 23% increase in conversion rates across all channels, with social media performing exceptionally well at 35% above target. Our email campaigns also showed strong performance with 18% higher open rates. The influencer partnerships delivered 3x ROI. I\'ve included detailed recommendations for Q1 budget reallocation, suggesting we increase social media spend by 40% and expand our influencer program. The data shows we should also invest more in video content creation. Please review the attached analysis and let me know your thoughts on the proposed budget adjustments.',
      priority: 'medium',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      domain: 'company.com',
      isExpanded: false
    },
    {
      id: '3',
      sender: 'hr@company.com',
      subject: 'Benefits Enrollment Deadline Approaching - New Health Plans Available',
      summary: 'Annual benefits enrollment deadline is December 15th. New health plan options available including enhanced mental health coverage and wellness programs.',
      content: 'This is a friendly reminder that the annual benefits enrollment deadline is approaching on December 15th. We have exciting new health plan options available this year, including enhanced mental health coverage, expanded wellness programs, and flexible spending account improvements. The new plans offer better coverage for preventive care and include access to telehealth services. We\'ve also added a new dental plan option with orthodontic coverage. Please log into the benefits portal at your earliest convenience to review your options and make your selections. If you need assistance, our HR team is available for one-on-one consultations. Don\'t miss this opportunity to optimize your benefits package for the coming year.',
      priority: 'low',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: false,
      domain: 'company.com',
      isExpanded: false
    },
    {
      id: '4',
      sender: 'david.chen@partner-agency.com',
      subject: 'Partnership Proposal - Strategic Collaboration Opportunity',
      summary: 'David proposes strategic partnership for Q1 product launch. Includes co-marketing opportunities and shared resource allocation.',
      content: 'I hope this email finds you well. I\'m reaching out to propose a strategic partnership opportunity that could benefit both our organizations. We\'ve been following your company\'s impressive growth and believe there\'s significant synergy between our services. For your upcoming Q1 product launch, we could offer co-marketing support, shared event hosting, and cross-promotional opportunities. Our agency has strong relationships with key industry publications and could help amplify your launch messaging. We\'re also willing to provide design and content creation resources at a reduced rate. I\'d love to schedule a call to discuss this partnership in detail and explore how we can create mutual value. Are you available for a 30-minute call next week?',
      priority: 'medium',
      suggestedReply: 'Hi David, thank you for the partnership proposal. The collaboration opportunity sounds interesting, especially for our Q1 launch. I\'d like to schedule a call to discuss the details and explore potential synergies. Let me check my calendar and get back to you with some time options.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
      domain: 'partner-agency.com',
      isExpanded: false
    }
  ],
  meetings: [
    {
      id: '1',
      title: 'Product Strategy Review',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: 60,
      participants: ['Sarah Johnson', 'Mike Chen', 'Jessica Williams'],
      status: 'scheduled',
      platform: 'Zoom'
    },
    {
      id: '2',
      title: 'Weekly Team Sync',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: 30,
      participants: ['Team'],
      status: 'scheduled',
      platform: 'Google Meet'
    },
    {
      id: '3',
      title: 'Client Onboarding',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      duration: 45,
      participants: ['John Doe', 'Jane Smith'],
      status: 'completed',
      platform: 'Zoom'
    }
  ],
  chatMessages: [], // Initialize empty, using chatSessions instead
  challenges: [
    {
      id: '1',
      title: 'Focus Master',
      description: 'Complete 5 focus sessions of at least 25 minutes',
      target: 5,
      progress: 3,
      reward: 50,
      type: 'weekly',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Task Crusher',
      description: 'Complete 20 tasks this week',
      target: 20,
      progress: 12,
      reward: 100,
      type: 'weekly',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  ],
  rewards: [
    {
      id: '1',
      title: 'Coffee Break Voucher',
      description: 'A voucher for a free coffee at your favorite cafe.',
      cost: 50,
      imageUrl: '/images/coffee.png',
      category: 'wellness',
      type: 'voucher',
      isRedeemed: false
    },
    {
      id: '2',
      title: 'Extra 30 Minutes Focus Time',
      description: 'Add 30 minutes to your next focus session.',
      cost: 75,
      imageUrl: '/images/focus.png',
      category: 'productivity',
      type: 'discount',
      isRedeemed: false
    },
    {
      id: '3',
      title: 'Desk Plant',
      description: 'A small desk plant to brighten your workspace.',
      cost: 100,
      imageUrl: '/images/plant.png',
      category: 'wellness',
      type: 'voucher',
      isRedeemed: false
    }
  ],
  userHistory: [],
  wellnessNudges: [
    {
      id: '1',
      type: 'break',
      title: 'Time for a quick stretch!',
      description: 'You\'ve been working hard. Stand up, stretch, and take a short walk.',
      action: 'Stretch for 5 minutes',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      autoDismiss: false
    },
    {
      id: '2',
      type: 'hydration',
      title: 'Stay hydrated!',
      description: 'Remember to drink some water. Your brain will thank you.',
      action: 'Drink a glass of water',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      autoDismiss: true
    }
  ],
  focusSession: null,
  isVoiceActive: false,
  activeView: 'dashboard',
  selectedTags: [],
  productivityScore: 0, // Calculated dynamically
  streak: 0,
  totalCompleted: 0,
  widgetOrder: ['statsCards', 'streakCard', 'meetingCard', 'aiGlassesCard', 'appUsage', 'taskInput', 'taskList', 'calendar', 'wellness', 'email'],
  chatSessions: [
    {
      id: '1',
      title: 'Project Alpha Brainstorm',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 1000),
      status: 'active',
      messages: [
        {
          id: 'msg1',
          sessionId: '1',
          role: 'assistant',
          content: 'Hello! How can I assist you with Project Alpha today?',
          timestamp: new Date(Date.now() - 60 * 1000)
        },
        {
          id: 'msg2',
          sessionId: '1',
          role: 'user',
          content: 'I need some ideas for marketing strategies for Project Alpha.',
          timestamp: new Date(Date.now() - 30 * 1000)
        },
        {
          id: 'msg3',
          sessionId: '1',
          role: 'assistant',
          content: 'Certainly! For Project Alpha, consider a multi-channel approach: targeted social media campaigns, influencer collaborations, content marketing (blog posts, videos), and strategic partnerships. Would you like to dive deeper into any of these?',
          timestamp: new Date(Date.now() - 10 * 1000)
        }
      ]
    },
    {
      id: '2',
      title: 'Daily Standup Prep',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 120 * 1000),
      status: 'active',
      messages: [
        {
          id: 'msg4',
          sessionId: '2',
          role: 'assistant',
          content: 'What are your key updates for the daily standup?',
          timestamp: new Date(Date.now() - 120 * 1000)
        }
      ]
    }
  ],
  activeChatSessionId: '1',
  glassDevices: [
    {
      id: 'glass-1',
      name: 'Glass Device 1',
      model: 'NeuroGlass X1',
      status: 'connected',
      batteryLevel: 85,
      lastSynced: new Date(Date.now() - 5 * 60 * 1000),
      firmwareVersion: '1.2.0',
      serialNumber: 'NGX1-12345678'
    },
    {
      id: 'glass-2',
      name: 'Glass Device 2',
      model: 'NeuroGlass X1',
      status: 'disconnected',
      batteryLevel: 0,
      lastSynced: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      firmwareVersion: '1.1.0',
      serialNumber: 'NGX1-87654321'
    }
  ],
  virtualCards: [
    {
      id: 'vc-1',
      label: 'Project Alpha Budget',
      cardNumber: '1234',
      cardHolder: 'John Doe',
      expiryDate: '12/25',
      cvv: '123',
      balance: 1500.00,
      spendingLimit: 2000.00,
      spentToday: 0,
      status: 'active',
      glassDeviceId: 'glass-1'
    },
    {
      id: 'vc-2',
      label: 'Marketing Expenses',
      cardNumber: '5678',
      cardHolder: 'John Doe',
      expiryDate: '06/24',
      cvv: '456',
      balance: 300.50,
      spendingLimit: 500.00,
      spentToday: 0,
      status: 'active',
      glassDeviceId: 'glass-1'
    }
  ],
  transactions: [
    {
      id: 't-1',
      description: 'Software Subscription',
      merchant: 'Adobe',
      amount: 49.99,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'completed',
      category: 'software',
      glassDeviceId: 'glass-1',
      virtualCardId: 'vc-1'
    },
    {
      id: 't-2',
      description: 'Social Media Ads',
      merchant: 'Facebook',
      amount: 120.00,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'completed',
      category: 'marketing',
      glassDeviceId: 'glass-1',
      virtualCardId: 'vc-2'
    },
    {
      id: 't-3',
      description: 'Freelancer Payment',
      merchant: 'Upwork',
      amount: 500.00,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed',
      category: 'services',
      glassDeviceId: 'glass-1',
      virtualCardId: 'vc-1'
    }
  ],
  voiceCommands: [
    {
      id: 'vc-1',
      phrase: 'create task',
      description: 'Creates a new task',
      action: 'create_task'
    },
    {
      id: 'vc-2',
      phrase: 'set reminder',
      description: 'Sets a reminder for a specific time or event',
      action: 'set_reminder'
    },
    {
      id: 'vc-3',
      phrase: 'read emails',
      description: 'Reads out unread emails',
      action: 'read_emails'
    }
  ]
};

function calculateProductivityScore(tasks: Task[]): number {
  if (tasks.length === 0) return 0;

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const baseScore = (completedTasks / totalTasks) * 100;

  // Bonus for high-priority completed tasks
  const highPriorityCompleted = tasks.filter(task =>
    task.status === 'completed' && task.priority === 'high'
  ).length;
  const highPriorityBonus = highPriorityCompleted * 10;

  // Bonus for AI-generated tasks (shows engagement with AI features)
  const aiTasksCompleted = tasks.filter(task =>
    task.status === 'completed' && task.isAIGenerated
  ).length;
  const aiBonus = aiTasksCompleted * 5;

  return Math.min(Math.round(baseScore + highPriorityBonus + aiBonus), 100);
}

function generateWellnessNudge(): WellnessNudge {
  const nudgeTypes = [
    {
      type: 'hydration' as const,
      title: 'Hydration reminder! 💧',
      description: 'Your brain is 75% water. Staying hydrated improves focus and cognitive performance.',
      action: 'Drink a glass of water and notice how you feel'
    },
    {
      type: 'posture' as const,
      title: 'Posture check! 🧘‍♀️',
      description: 'Good posture reduces fatigue and improves concentration. Let\'s reset your alignment.',
      action: 'Roll your shoulders back, align your spine, and take 3 deep breaths'
    },
    {
      type: 'breathing' as const,
      title: 'Breathing break! 🌬️',
      description: 'Deep breathing activates your parasympathetic nervous system and reduces stress.',
      action: 'Try box breathing: inhale 4, hold 4, exhale 4, hold 4. Repeat 4 times'
    },
    {
      type: 'motivation' as const,
      title: 'You\'re doing great! 🌟',
      description: 'Acknowledging progress boosts motivation and maintains positive momentum.',
      action: 'Take a moment to appreciate what you\'ve accomplished today'
    }
  ];

  const randomNudge = nudgeTypes[Math.floor(Math.random() * nudgeTypes.length)];

  return {
    id: Date.now().toString(),
    ...randomNudge,
    timestamp: new Date(),
    autoDismiss: true
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'ADD_CHAT_MESSAGE':
      // This action is handled within 'ADD_MESSAGE_TO_SESSION' for specific sessions
      // For now, we'll just return state if it's not handled by a session-specific action
      return state;
    case 'SET_VOICE_ACTIVE':
      return { ...state, isVoiceActive: action.payload };
    case 'SET_ACTIVE_VIEW':
      return { ...state, activeView: action.payload };
    case 'DISMISS_NUDGE':
      return {
        ...state,
        wellnessNudges: state.wellnessNudges.filter(nudge => nudge.id !== action.payload),
      };
    case 'MARK_EMAIL_READ':
      return {
        ...state,
        emails: state.emails.map(email =>
          email.id === action.payload ? { ...email, isRead: true } : email
        ),
      };
    case 'TOGGLE_EMAIL_EXPANDED':
      return {
        ...state,
        emails: state.emails.map(email =>
          email.id === action.payload ? { ...email, isExpanded: !email.isExpanded } : email
        ),
      };
    case 'SET_SELECTED_TAGS':
      return { ...state, selectedTags: action.payload };
    case 'START_FOCUS_SESSION':
      return {
        ...state,
        focusSession: {
          id: Date.now().toString(),
          isActive: true,
          startTime: new Date(),
          duration: action.payload.duration,
          remainingTime: action.payload.duration,
        },
      };
    case 'END_FOCUS_SESSION':
      return { ...state, focusSession: null };
    case 'UPDATE_FOCUS_SESSION':
      if (!state.focusSession) return state;
      return {
        ...state,
        focusSession: {
          ...state.focusSession,
          remainingTime: action.payload.remainingTime,
        },
      };
    case 'UPDATE_PRODUCTIVITY_SCORE':
      return { ...state, productivityScore: calculateProductivityScore(state.tasks) };
    case 'ADD_WELLNESS_NUDGE':
      return { ...state, wellnessNudges: [...state.wellnessNudges, action.payload] };
    case 'SET_WIDGET_ORDER':
      return { ...state, widgetOrder: action.payload };
    case 'UPDATE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map(challenge =>
          challenge.id === action.payload.id ? { ...challenge, ...action.payload.updates } : challenge
        ),
      };
    case 'REDEEM_REWARD':
      // Logic to handle reward redemption (e.g., deduct points, mark reward as redeemed)
      // For now, just return state
      return state;
    case 'CREATE_CHAT_SESSION':
      return {
        ...state,
        chatSessions: [...state.chatSessions, {
          id: action.payload.id,
          title: action.payload.title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'active'
        }],
        activeChatSessionId: action.payload.id,
      };
    case 'DELETE_CHAT_SESSION':
      return {
        ...state,
        chatSessions: state.chatSessions.filter(session => session.id !== action.payload),
        activeChatSessionId: state.activeChatSessionId === action.payload ? null : state.activeChatSessionId,
      };
    case 'RENAME_CHAT_SESSION':
      return {
        ...state,
        chatSessions: state.chatSessions.map(session =>
          session.id === action.payload.id ? { ...session, title: action.payload.title } : session
        ),
      };
    case 'SET_ACTIVE_CHAT_SESSION':
      return { ...state, activeChatSessionId: action.payload };
    case 'ADD_MESSAGE_TO_SESSION':
      return {
        ...state,
        chatSessions: state.chatSessions.map(session =>
          session.id === action.payload.sessionId
            ? { ...session, messages: [...session.messages, action.payload.message] }
            : session
        ),
      };
    case 'SET_MEETINGS':
      return { ...state, meetings: action.payload };
    case 'ADD_MEETING':
      return { ...state, meetings: [...state.meetings, action.payload] };
    case 'END_MEETING':
      return {
        ...state,
        meetings: state.meetings.map(meeting =>
          meeting.id === action.payload.id ? { ...meeting, status: 'completed', summary: action.payload.summary } : meeting
        ),
      };
    case 'SET_CHALLENGES':
      return { ...state, challenges: action.payload };
    case 'SET_REWARDS':
      return { ...state, rewards: action.payload };
    case 'UPDATE_USER_STATS':
      return { ...state, ...action.payload };
    case 'UPDATE_CHALLENGE_PROGRESS':
      return {
        ...state,
        challenges: state.challenges.map(challenge =>
          challenge.id === action.payload.id ? { ...challenge, progress: action.payload.progress } : challenge
        ),
      };
    case 'ADD_DEVICE':
      return { ...state, glassDevices: [...state.glassDevices, action.payload] };
    case 'UPDATE_DEVICE_STATUS':
      return {
        ...state,
        glassDevices: state.glassDevices.map(device =>
          device.id === action.payload.id ? { ...device, status: action.payload.status } : device
        ),
      };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_CARD_SETTINGS':
      return {
        ...state,
        virtualCards: state.virtualCards.map(card =>
          card.id === action.payload.id ? { ...card, ...action.payload.updates } : card
        ),
      };
    case 'ADD_VOICE_COMMAND':
      return { ...state, voiceCommands: [...state.voiceCommands, action.payload] };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    productivityScore: calculateProductivityScore(initialState.tasks)
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyThemeToDocument(state.theme);
  }, [state.theme]);

  // Auto-dismiss wellness nudges after 10 seconds
  useEffect(() => {
    const autoDismissNudges = state.wellnessNudges.filter(nudge => nudge.autoDismiss);

    autoDismissNudges.forEach(nudge => {
      const timeElapsed = Date.now() - nudge.timestamp.getTime();
      const remainingTime = 10000 - timeElapsed; // 10 seconds

      if (remainingTime > 0) {
        setTimeout(() => {
          dispatch({ type: 'DISMISS_NUDGE', payload: nudge.id });
        }, remainingTime);
      } else {
        dispatch({ type: 'DISMISS_NUDGE', payload: nudge.id });
      }
    });
  }, [state.wellnessNudges]);

  // Generate periodic wellness nudges
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a wellness nudge every 30 minutes (for demo, using shorter interval)
      if (Math.random() < 0.3) { // 30% chance every interval
        const nudge = generateWellnessNudge();
        dispatch({ type: 'ADD_WELLNESS_NUDGE', payload: nudge });
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Update focus session timer
  useEffect(() => {
    if (state.focusSession?.isActive) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.focusSession!.startTime.getTime()) / 1000 / 60);
        const remaining = state.focusSession!.duration - elapsed;

        if (remaining <= 0) {
          dispatch({ type: 'END_FOCUS_SESSION' });
          // Add completion nudge
          const completionNudge: WellnessNudge = {
            id: Date.now().toString(),
            type: 'motivation',
            title: 'Focus session completed! 🎉',
            description: 'Congratulations on completing your focus session. You\'ve made great progress!',
            action: 'Take a well-deserved break and reflect on what you accomplished',
            timestamp: new Date(),
            autoDismiss: true
          };
          dispatch({ type: 'ADD_WELLNESS_NUDGE', payload: completionNudge });
        } else {
          dispatch({ type: 'UPDATE_FOCUS_SESSION', payload: { remainingTime: remaining } });
        }
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [state.focusSession]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}