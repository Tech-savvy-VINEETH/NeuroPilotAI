import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Task, Email, ChatMessage, WellnessNudge, FocusSession, Theme, Mode } from '../types';

interface AppState {
  theme: Theme;
  mode: Mode;
  tasks: Task[];
  emails: Email[];
  chatMessages: ChatMessage[];
  wellnessNudges: WellnessNudge[];
  focusSession: FocusSession | null;
  isVoiceActive: boolean;
  activeView: 'dashboard' | 'tasks' | 'emails' | 'chat' | 'settings';
  selectedTags: string[];
  productivityScore: number;
}

type AppAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_MODE'; payload: Mode }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_VOICE_ACTIVE'; payload: boolean }
  | { type: 'SET_ACTIVE_VIEW'; payload: AppState['activeView'] }
  | { type: 'DISMISS_NUDGE'; payload: string }
  | { type: 'MARK_EMAIL_READ'; payload: string }
  | { type: 'TOGGLE_EMAIL_EXPANDED'; payload: string }
  | { type: 'SET_SELECTED_TAGS'; payload: string[] }
  | { type: 'START_FOCUS_SESSION'; payload: { duration: number } }
  | { type: 'END_FOCUS_SESSION' }
  | { type: 'UPDATE_FOCUS_SESSION'; payload: { remainingTime: number } }
  | { type: 'UPDATE_PRODUCTIVITY_SCORE' }
  | { type: 'ADD_WELLNESS_NUDGE'; payload: WellnessNudge };

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
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: false,
      domain: 'partner-agency.com',
      isExpanded: false
    }
  ],
  chatMessages: [
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to NeuroPilot! 🧠✨ I\'m your AI productivity assistant, ready to help you optimize your day. I can help you manage tasks, analyze your productivity, suggest focus strategies, and provide wellness reminders. What would you like to focus on today?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    }
  ],
  wellnessNudges: [
    {
      id: '1',
      type: 'break',
      title: 'Time for a productivity break! 🌟',
      description: 'You\'ve been focused for 45 minutes. Research shows that taking a 5-10 minute break can boost your productivity by up to 23%.',
      action: 'Try the 5-4-3-2-1 grounding technique or take a short walk',
      timestamp: new Date(),
      autoDismiss: true
    }
  ],
  focusSession: {
    id: '1',
    startTime: new Date(Date.now() - 15 * 60 * 1000), // Started 15 minutes ago
    duration: 225, // 3h 45m in minutes
    isActive: true,
    remainingTime: 210 // 3h 30m remaining
  },
  isVoiceActive: false,
  activeView: 'dashboard',
  selectedTags: [],
  productivityScore: 0
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
      const newTasks = [...state.tasks, action.payload];
      return { 
        ...state, 
        tasks: newTasks,
        productivityScore: calculateProductivityScore(newTasks)
      };
    case 'UPDATE_TASK':
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.updates }
          : task
      );
      return {
        ...state,
        tasks: updatedTasks,
        productivityScore: calculateProductivityScore(updatedTasks)
      };
    case 'DELETE_TASK':
      const filteredTasks = state.tasks.filter(task => task.id !== action.payload);
      return {
        ...state,
        tasks: filteredTasks,
        productivityScore: calculateProductivityScore(filteredTasks)
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload]
      };
    case 'SET_VOICE_ACTIVE':
      return { ...state, isVoiceActive: action.payload };
    case 'SET_ACTIVE_VIEW':
      return { ...state, activeView: action.payload };
    case 'DISMISS_NUDGE':
      return {
        ...state,
        wellnessNudges: state.wellnessNudges.filter(nudge => nudge.id !== action.payload)
      };
    case 'ADD_WELLNESS_NUDGE':
      return {
        ...state,
        wellnessNudges: [...state.wellnessNudges, action.payload]
      };
    case 'MARK_EMAIL_READ':
      return {
        ...state,
        emails: state.emails.map(email =>
          email.id === action.payload
            ? { ...email, isRead: true }
            : email
        )
      };
    case 'TOGGLE_EMAIL_EXPANDED':
      return {
        ...state,
        emails: state.emails.map(email =>
          email.id === action.payload
            ? { ...email, isExpanded: !email.isExpanded }
            : email
        )
      };
    case 'SET_SELECTED_TAGS':
      return { ...state, selectedTags: action.payload };
    case 'START_FOCUS_SESSION':
      return {
        ...state,
        focusSession: {
          id: Date.now().toString(),
          startTime: new Date(),
          duration: action.payload.duration,
          isActive: true,
          remainingTime: action.payload.duration
        }
      };
    case 'END_FOCUS_SESSION':
      return { ...state, focusSession: null };
    case 'UPDATE_FOCUS_SESSION':
      return {
        ...state,
        focusSession: state.focusSession ? {
          ...state.focusSession,
          remainingTime: action.payload.remainingTime
        } : null
      };
    case 'UPDATE_PRODUCTIVITY_SCORE':
      return {
        ...state,
        productivityScore: calculateProductivityScore(state.tasks)
      };
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