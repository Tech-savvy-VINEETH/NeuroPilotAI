
// AI Service with Enhanced Backend Integration
import OpenAI from 'openai';

// Backend API configuration
const BACKEND_URL = 'http://localhost:8000';

// Initialize OpenAI client with proper error handling (fallback)
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

let openai: OpenAI | null = null;

if (apiKey && apiKey !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
  });
}

export interface TaskAnalysis {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  tags: string[];
  category: string;
  dueDate?: string;
}

export interface ActionResponse {
  type: 'action';
  action: 'schedule_meeting' | 'create_task' | 'send_email' | 'update_task';
  data: any;
  response: string;
}

export interface ChatResponse {
  type: 'chat';
  response: string;
}

// Enhanced chat response using backend with context
export async function generateChatResponse(message: string, context?: any): Promise<string | ActionResponse | ChatResponse> {
  try {
    // Try backend first with enhanced context
    const response = await fetch(`${BACKEND_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: message,
        context: context
      }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (response.ok) {
      const data = await response.json();
      // Return the full object if it has a type (action or chat), otherwise just the answer string
      if (data.type) {
        return data as ActionResponse | ChatResponse;
      }
      return data.answer || "I'm here to help optimize your productivity! How can I assist you today?";
    } else {
      throw new Error(`Backend API failed with status ${response.status}`);
    }
  } catch (error) {
    // Don't log warnings to console to avoid spam
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Backend request timed out, using fallback response');
    }

    // Fallback to OpenAI if available
    if (openai) {
      try {
        const contextInfo = context ? `
        Current context:
        - Tasks: ${context.tasks?.length || 0} total (${context.tasks?.filter((t: any) => t.status === 'completed').length || 0} completed)
        - Productivity Score: ${context.productivityScore || 0}%
        - Mode: ${context.mode || 'focus'}
        - Focus Session: ${context.focusSession?.isActive ? `Active (${context.focusSession.remainingTime}m remaining)` : 'Not active'}
        ` : '';

        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are NeuroPilot, an AI productivity assistant. You help users manage tasks, optimize schedules, maintain wellness, and boost productivity. 
              
              Key capabilities:
              - Task management and prioritization
              - Time management and focus techniques
              - Wellness and break reminders
              - Productivity insights and suggestions
              - Schedule optimization
              - Motivational support

              Be helpful, concise, actionable, and encouraging. Provide specific, practical advice. Use the context provided to give personalized responses.${contextInfo}`
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.8,
          max_tokens: 400
        });

        return response.choices[0].message?.content || "I'm here to help optimize your productivity! How can I assist you today?";
      } catch (openaiError) {
        // Don't log errors to console to avoid spam
      }
    }

    // Final fallback to enhanced local responses
    return generateEnhancedChatResponse(message, context);
  }
}

export async function generateTaskInsights(prompt: string): Promise<TaskAnalysis> {
  try {
    // Try backend for task analysis
    const response = await fetch(`${BACKEND_URL}/analyze-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskDescription: prompt
      }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (response.ok) {
      const data = await response.json();
      if (data.analysis) {
        return data.analysis;
      }
    }
  } catch (error) {
    // Don't log warnings to console to avoid spam
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Backend task analysis timed out, using fallback');
    }
  }

  // Fallback to OpenAI or enhanced local processing
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are NeuroPilot, an AI productivity assistant. Analyze the user's task request and return a JSON object with the following structure:
            {
              "title": "Clear, actionable task title",
              "description": "Detailed description with context and actionable steps",
              "priority": "high|medium|low",
              "estimatedTime": number_in_minutes,
              "tags": ["relevant", "tags"],
              "category": "work|personal|health|learning|communication|creative|planning",
              "dueDate": "YYYY-MM-DD or null if not specified"
            }
            
            Analyze urgency keywords (urgent, asap, deadline, today, tomorrow), complexity indicators, and context to determine priority and realistic time estimates. Be intelligent about categorization and tagging.`
          },
          {
            role: "user",
            content: `Structure this task intelligently: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const content = response.choices[0].message?.content;
      if (content) {
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('OpenAI task analysis failed:', error);
    }
  }

  return generateEnhancedFallbackTask(prompt);
}

export async function generateEmailReply(emailContent: string, context: string): Promise<string> {
  try {
    // Try backend for email reply
    const response = await fetch(`${BACKEND_URL}/generate-email-reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailContent: emailContent,
        context: context
      }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (response.ok) {
      const data = await response.json();
      return data.reply || "Thank you for your email. I'll review this and get back to you shortly.";
    }
  } catch (error) {
    // Don't log warnings to console to avoid spam
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Backend email reply timed out, using fallback');
    }
  }

  // Fallback to OpenAI or enhanced local processing
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a professional email assistant. Generate concise, professional email replies that are:
            - Contextually appropriate and actionable
            - Professional but warm in tone
            - Clear and direct
            - Include next steps when relevant
            - 2-3 sentences maximum`
          },
          {
            role: "user",
            content: `Generate a professional reply for this email: ${emailContent}\n\nContext: ${context}`
          }
        ],
        temperature: 0.6,
        max_tokens: 200
      });

      return response.choices[0].message?.content || "Thank you for your email. I'll review this and get back to you shortly.";
    } catch (error) {
      console.error('OpenAI email reply failed:', error);
    }
  }

  return generateEnhancedEmailReply(emailContent, context);
}

// Enhanced fallback functions with intelligent behavior
function generateEnhancedFallbackTask(prompt: string): TaskAnalysis {
  const lowerPrompt = prompt.toLowerCase();

  // Analyze urgency keywords
  const urgencyKeywords = ['urgent', 'asap', 'immediately', 'deadline', 'due today', 'critical'];
  const isUrgent = urgencyKeywords.some(keyword => lowerPrompt.includes(keyword));

  // Analyze complexity indicators
  const complexKeywords = ['presentation', 'report', 'analysis', 'research', 'strategy', 'plan'];
  const isComplex = complexKeywords.some(keyword => lowerPrompt.includes(keyword));

  // Determine priority
  let priority: 'high' | 'medium' | 'low' = 'medium';
  if (isUrgent) priority = 'high';
  else if (lowerPrompt.includes('low priority') || lowerPrompt.includes('when possible')) priority = 'low';

  // Estimate time based on task type
  let estimatedTime = 60; // default
  if (lowerPrompt.includes('email') || lowerPrompt.includes('call') || lowerPrompt.includes('message')) estimatedTime = 15;
  else if (lowerPrompt.includes('meeting')) estimatedTime = 30;
  else if (isComplex) estimatedTime = 120;

  // Intelligent task mapping
  const taskMappings: Record<string, Partial<TaskAnalysis>> = {
    'pitch': {
      title: 'Prepare investor pitch presentation',
      description: 'Create comprehensive pitch deck covering problem, solution, market size, business model, and financial projections. Include compelling visuals and practice delivery.',
      category: 'work',
      tags: ['presentation', 'investors', 'business', 'strategy']
    },
    'email': {
      title: 'Send important email',
      description: 'Compose and send professional email with clear subject line, proper formatting, and actionable next steps.',
      category: 'communication',
      tags: ['communication', 'follow-up']
    },
    'meeting': {
      title: 'Schedule team meeting',
      description: 'Organize meeting with clear agenda, invite relevant stakeholders, and prepare discussion points and materials.',
      category: 'work',
      tags: ['meeting', 'team', 'planning']
    },
    'report': {
      title: 'Create detailed report',
      description: 'Research, analyze data, and compile comprehensive report with insights, recommendations, and supporting evidence.',
      category: 'work',
      tags: ['analysis', 'research', 'documentation']
    },
    'client': {
      title: 'Client communication task',
      description: 'Handle client-related communication, updates, or deliverables with professional service and attention to detail.',
      category: 'communication',
      tags: ['clients', 'service', 'relationship']
    }
  };

  // Find best match
  for (const [key, value] of Object.entries(taskMappings)) {
    if (lowerPrompt.includes(key)) {
      return {
        title: value.title!,
        description: value.description!,
        priority,
        estimatedTime,
        tags: value.tags!,
        category: value.category!,
        dueDate: undefined
      };
    }
  }

  // Generic intelligent task creation
  return {
    title: prompt.charAt(0).toUpperCase() + prompt.slice(1),
    description: `Complete this task efficiently with attention to quality and deadlines. Break down into smaller steps if needed.`,
    priority,
    estimatedTime,
    tags: ['general', 'productivity'],
    category: 'work'
  };
}

function generateEnhancedChatResponse(message: string, context?: any): string {
  const lowerMessage = message.toLowerCase();
  const tasks = context?.tasks || [];
  const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t: any) => t.status === 'pending').length;
  const highPriorityTasks = tasks.filter((t: any) => t.priority === 'high' && t.status !== 'completed');

  // Intelligent response patterns
  const responses = {
    focus: [
      `Based on your ${pendingTasks} pending tasks, I recommend starting with your ${highPriorityTasks.length} high-priority items. Would you like me to suggest a focus block schedule?`,
      `You're in ${context?.mode || 'focus'} mode. Let's tackle your most important tasks first. You have ${highPriorityTasks.length} high-priority items that need attention.`,
      `Great question! Your productivity score is ${context?.productivityScore || 0}%. Focus on completing your high-priority tasks to boost your score.`
    ],
    plan: [
      `Here's your day at a glance: ${completedTasks} tasks completed, ${pendingTasks} remaining. Your next priority should be the high-impact tasks.`,
      `Today's plan: You have ${tasks.length} total tasks. I suggest time-blocking your high-priority items during your peak energy hours.`,
      `Your daily overview: ${Math.round((completedTasks / Math.max(tasks.length, 1)) * 100)}% complete. Let's optimize the remaining tasks for maximum productivity.`
    ],
    break: [
      `Perfect timing for a break! Try the 5-4-3-2-1 grounding technique: 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.`,
      `Break time! Step away from your screen for 5-10 minutes. Try some neck rolls, shoulder shrugs, or a quick walk.`,
      `Smart move! Taking breaks improves focus by 23%. Try the 20-20-20 rule: look at something 20 feet away for 20 seconds every 20 minutes.`
    ],
    wellness: [
      `Wellness check! Remember to stay hydrated (8 glasses daily), maintain good posture, and take regular breaks.`,
      `Your wellbeing matters! Try box breathing: inhale 4 counts, hold 4, exhale 4, hold 4. Repeat 4 times.`,
      `Wellness tip: The 2-minute rule - if a task takes less than 2 minutes, do it now. This prevents small tasks from piling up.`
    ],
    motivation: [
      `You've got this! You've already completed ${completedTasks} tasks today. That's ${Math.round((completedTasks / Math.max(tasks.length, 1)) * 100)}% progress!`,
      `Stay strong! Every completed task is a step toward your goals. You're building momentum with each accomplishment.`,
      `Remember: Progress over perfection. You're doing great by staying organized and focused on what matters most.`
    ]
  };

  // Pattern matching for intelligent responses
  if (lowerMessage.includes('focus') || lowerMessage.includes('concentrate') || lowerMessage.includes('priority')) {
    return responses.focus[Math.floor(Math.random() * responses.focus.length)];
  }

  if (lowerMessage.includes('plan') || lowerMessage.includes('schedule') || lowerMessage.includes('today') || lowerMessage.includes('summary')) {
    return responses.plan[Math.floor(Math.random() * responses.plan.length)];
  }

  if (lowerMessage.includes('break') || lowerMessage.includes('rest') || lowerMessage.includes('tired') || lowerMessage.includes('pause')) {
    return responses.break[Math.floor(Math.random() * responses.break.length)];
  }

  if (lowerMessage.includes('wellness') || lowerMessage.includes('health') || lowerMessage.includes('hydrate') || lowerMessage.includes('stretch')) {
    return responses.wellness[Math.floor(Math.random() * responses.wellness.length)];
  }

  if (lowerMessage.includes('motivation') || lowerMessage.includes('encourage') || lowerMessage.includes('stuck') || lowerMessage.includes('help')) {
    return responses.motivation[Math.floor(Math.random() * responses.motivation.length)];
  }

  // Default intelligent response
  return `I'm here to help optimize your productivity! You currently have ${pendingTasks} pending tasks and a ${context?.productivityScore || 0}% productivity score. What would you like to focus on?`;
}

function generateEnhancedEmailReply(emailContent: string, context: string): string {
  const lowerContent = emailContent.toLowerCase();

  // Use context to provide more personalized responses
  const isWorkRelated = context.toLowerCase().includes('work') || context.toLowerCase().includes('business');

  if (lowerContent.includes('deadline') || lowerContent.includes('urgent')) {
    const urgency = isWorkRelated ? "I'll prioritize this and provide a response by end of day." : "I'll get back to you as soon as possible.";
    return `Thank you for the urgent update. ${urgency} I'll keep you posted on progress.`;
  }

  if (lowerContent.includes('meeting') || lowerContent.includes('schedule')) {
    const scheduling = isWorkRelated ? "I'll check my work calendar" : "I'll check my schedule";
    return `Thanks for reaching out about scheduling. ${scheduling} and send you a few time options that work well for both of us.`;
  }

  if (lowerContent.includes('project') || lowerContent.includes('update')) {
    const response = isWorkRelated ? "Thank you for the project update. I'll review the details and provide feedback shortly." : "Thank you for the update. I'll review this and get back to you.";
    return `${response} Let me know if you need anything else in the meantime.`;
  }

  if (lowerContent.includes('question') || lowerContent.includes('clarification')) {
    const timeframe = isWorkRelated ? "within 24 hours" : "as soon as I can";
    return `Great question! I'll gather the information you need and get back to you with a comprehensive response ${timeframe}.`;
  }

  // Use context for more personalized closing
  const closing = isWorkRelated ? "I appreciate your communication and look forward to working with you." : "I appreciate you reaching out.";
  return `Thank you for your email. I've received your message and will respond appropriately. ${closing}`;
}