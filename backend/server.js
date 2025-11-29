import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { google } from 'googleapis';
import fs from 'fs';

const app = express();
const PORT = 8000;

// CORS middleware for frontend integration
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["*"]
}));

// JSON parsing middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: "NeuroPilot AI Backend is running!",
    status: "healthy"
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: "healthy",
    service: "NeuroPilot AI Backend",
    version: "1.0.0"
  });
});

// Calendar endpoints
app.get('/calendar/events/today', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
      return res.status(401).json({
        error: "Access token is required"
      });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth });

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.json({
      events: response.data.items || [],
      status: "success"
    });
  } catch (error) {
    console.error('Error fetching today\'s events:', error);
    res.status(500).json({
      error: "Failed to fetch today's events",
      details: error.message
    });
  }
});

app.get('/calendar/events/upcoming', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    const days = parseInt(req.query.days) || 7;

    if (!accessToken) {
      return res.status(401).json({
        error: "Access token is required"
      });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth });

    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + days);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: future.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 50,
    });

    res.json({
      events: response.data.items || [],
      status: "success"
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({
      error: "Failed to fetch upcoming events",
      details: error.message
    });
  }
});

app.post('/calendar/events', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    const { event } = req.body;

    if (!accessToken) {
      return res.status(401).json({
        error: "Access token is required"
      });
    }

    if (!event) {
      return res.status(400).json({
        error: "Event data is required"
      });
    }

    // Mock for demo if token is 'mock-token'
    if (accessToken === 'mock-token') {
      return res.json({
        event: {
          id: 'mock-event-id-' + Date.now(),
          ...event,
          status: 'confirmed',
          htmlLink: 'https://calendar.google.com/mock'
        },
        status: "success"
      });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    res.json({
      event: response.data,
      status: "success"
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({
      error: "Failed to create calendar event",
      details: error.message
    });
  }
});

// Main chat endpoint with enhanced OpenRouter integration
app.post('/ask', async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({
        answer: "Please provide a question.",
        status: "error",
        error: "Missing question parameter"
      });
    }

    // Enhanced system prompt with context awareness
    let systemPrompt = `You are NeuroPilot, an intelligent AI productivity assistant. You help users with task management, productivity optimization, wellness reminders, schedule planning, and motivation.

Key capabilities:
- Task management and prioritization
- Time management and focus techniques  
- Wellness and break reminders
- Productivity insights and suggestions
- Schedule optimization
- Motivational support

Be concise, helpful, actionable, and encouraging. Provide specific, practical advice. Focus on productivity, time management, and wellness. Keep responses under 200 words and always be supportive and professional.

CRITICAL: You are an AI Agent capable of performing actions. When the user asks to do something specific (like schedule a meeting, create a task, or send an email), you MUST return a JSON object with the following structure:
{
  "type": "action",
  "action": "schedule_meeting" | "create_task" | "send_email" | "update_task",
  "data": { ...specific fields for the action... },
  "response": "A natural language response confirming the action proposal"
}

If the user just asks a question or wants to chat, return a standard text response or a JSON with type "chat":
{
  "type": "chat",
  "response": "Your natural language response"
}

Action Data Schemas:
1. schedule_meeting: { title, startTime (ISO string), duration (minutes), participants (array of strings) }
2. create_task: { title, description, priority (high/medium/low), estimatedTime (minutes) }
3. send_email: { recipient, subject, content }

ALWAYS return valid JSON. Do not include markdown formatting like \`\`\`json ... \`\`\`. Just the raw JSON string.`;

    // Add context information if provided
    if (context) {
      systemPrompt += `\n\nCurrent user context:
- Total tasks: ${context.tasks?.length || 0}
- Completed tasks: ${context.completedTasksToday || 0}
- Pending tasks: ${context.pendingTasks || 0}
- High priority tasks: ${context.highPriorityTasks || 0}
- Productivity score: ${context.productivityScore || 0}%
- Current mode: ${context.mode || 'focus'}
- Focus session: ${context.focusSession?.isActive ? `Active (${context.focusSession.remainingTime}m remaining)` : 'Not active'}

Use this context to provide personalized, relevant advice.`;
    }

    const headers = {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json",
    };

    const payload = {
      "model": "mistralai/mixtral-8x7b-instruct",
      "messages": [
        {
          "role": "system",
          "content": systemPrompt
        },
        {
          "role": "user",
          "content": question
        }
      ],
      "temperature": 0.7,
      "max_tokens": 400
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      let content = result.choices[0].message.content;

      // Attempt to parse JSON response
      let parsedResponse;
      try {
        // Clean up potential markdown formatting if the model adds it
        content = content.replace(/```json\n?|\n?```/g, '').trim();
        parsedResponse = JSON.parse(content);
      } catch (e) {
        // Fallback for non-JSON responses (treat as chat)
        parsedResponse = {
          type: "chat",
          response: content
        };
      }

      res.json({
        ...parsedResponse,
        status: "success",
        model: "mixtral-8x7b",
        context_used: !!context
      });
    } else {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', response.status, errorText);

      // Fallback for demo purposes when API fails (e.g. 401)
      const lowerQuestion = question.toLowerCase();
      let mockResponse;

      if (lowerQuestion.includes('schedule') && lowerQuestion.includes('meeting')) {
        mockResponse = {
          type: "action",
          action: "schedule_meeting",
          data: {
            title: "Team Meeting",
            startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            duration: 60,
            participants: ["Team"]
          },
          response: "I've drafted a meeting for tomorrow. Would you like to confirm?"
        };
      } else if (lowerQuestion.includes('task') || lowerQuestion.includes('remind')) {
        mockResponse = {
          type: "action",
          action: "create_task",
          data: {
            title: question.replace('create task', '').replace('remind me to', '').trim(),
            description: "Created via AI",
            priority: "medium",
            estimatedTime: 30
          },
          response: "I've created a task for you. Please confirm the details."
        };
      } else {
        mockResponse = {
          type: "chat",
          response: "I'm currently running in offline mode. I can still help you schedule meetings or create tasks if you be specific!"
        };
      }

      res.json({
        ...mockResponse,
        status: "success",
        model: "fallback-rule-engine",
        context_used: !!context
      });
    }

  } catch (error) {
    console.error('Server Error:', error);

    if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
      res.json({
        answer: "I'm taking a bit longer to respond than usual. In the meantime, remember to take breaks every hour and stay hydrated! What can I help you with?",
        status: "timeout"
      });
    } else {
      res.json({
        answer: "I encountered an issue, but I'm still here to help! Try asking about task prioritization, productivity tips, or wellness reminders.",
        status: "error",
        error: error.message
      });
    }
  }
});

// Task analysis endpoint
app.post('/analyze-task', async (req, res) => {
  try {
    const { taskDescription } = req.body;

    if (!taskDescription) {
      return res.status(400).json({
        error: "Task description is required"
      });
    }

    const headers = {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json",
    };

    const payload = {
      "model": "mistralai/mixtral-8x7b-instruct",
      "messages": [
        {
          "role": "system",
          "content": `You are a task analysis expert. Analyze the given task and return a JSON object with the following structure:
{
  "title": "Clear, actionable task title",
  "description": "Detailed description with context and actionable steps",
  "priority": "high|medium|low",
  "estimatedTime": number_in_minutes,
  "tags": ["relevant", "tags"],
  "category": "work|personal|health|learning|communication|creative|planning"
}

Analyze urgency keywords (urgent, asap, deadline, today, tomorrow), complexity indicators, and context to determine priority and realistic time estimates. Be intelligent about categorization and tagging.`
        },
        {
          "role": "user",
          "content": `Analyze this task: ${taskDescription}`
        }
      ],
      "temperature": 0.3,
      "max_tokens": 300
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      const content = result.choices[0].message.content;

      try {
        // Try to parse as JSON
        const taskAnalysis = JSON.parse(content);
        res.json({
          analysis: taskAnalysis,
          status: "success"
        });
      } catch (parseError) {
        // Fallback if JSON parsing fails
        res.json({
          analysis: {
            title: taskDescription,
            description: `Complete this task: ${taskDescription}`,
            priority: "medium",
            estimatedTime: 60,
            tags: ["general"],
            category: "work"
          },
          status: "fallback"
        });
      }
    } else {
      throw new Error(`API returned status ${response.status}`);
    }

  } catch (error) {
    console.error('Task analysis error:', error);
    res.status(500).json({
      error: "Failed to analyze task",
      details: error.message
    });
  }
});

// Email reply generation endpoint
app.post('/generate-email-reply', async (req, res) => {
  try {
    const { emailContent, context } = req.body;

    if (!emailContent) {
      return res.status(400).json({
        error: "Email content is required"
      });
    }

    const headers = {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json",
    };

    const payload = {
      "model": "mistralai/mixtral-8x7b-instruct",
      "messages": [
        {
          "role": "system",
          "content": `You are a professional email assistant. Generate concise, professional email replies that are:
- Contextually appropriate and actionable
- Professional but warm in tone
- Clear and direct
- Include next steps when relevant
- 2-3 sentences maximum`
        },
        {
          "role": "user",
          "content": `Generate a professional reply for this email: ${emailContent}\n\nContext: ${context || 'General business communication'}`
        }
      ],
      "temperature": 0.6,
      "max_tokens": 200
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      const reply = result.choices[0].message.content;

      res.json({
        reply: reply,
        status: "success"
      });
    } else {
      throw new Error(`API returned status ${response.status}`);
    }

  } catch (error) {
    console.error('Email reply generation error:', error);
    res.status(500).json({
      error: "Failed to generate email reply",
      details: error.message
    });
  }
});

// Analytics endpoint
app.post('/analytics', (req, res) => {
  try {
    const analyticsData = req.body;
    analyticsData.timestamp = new Date().toISOString();
    const logLine = JSON.stringify(analyticsData) + '\n';
    fs.appendFile('analytics.log', logLine, (err) => {
      if (err) {
        console.error('Failed to write analytics data:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to store analytics data' });
      }
      res.json({ status: 'success', message: 'Analytics data stored' });
    });
  } catch (error) {
    console.error('Analytics endpoint error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// --- Gamification Endpoints (In-Memory for Demo) ---

// Mock Data
let challenges = [
  { id: '1', title: 'Early Bird', description: 'Complete a task before 9 AM', type: 'daily', progress: 0, target: 1, reward: 50, status: 'active' },
  { id: '2', title: 'Focus Master', description: 'Complete 4 focus sessions', type: 'daily', progress: 1, target: 4, reward: 100, status: 'active' },
  { id: '3', title: 'Task Warrior', description: 'Complete 20 tasks this week', type: 'weekly', progress: 12, target: 20, reward: 300, status: 'active' }
];

let rewards = [
  { id: '1', title: 'Premium Theme Pack', cost: 500, isRedeemed: false, code: 'THEME-2024-X' },
  { id: '2', title: '1 Hour Consultation', cost: 1000, isRedeemed: false, code: 'CONSULT-AB12' },
  { id: '3', title: 'Productivity E-Book', cost: 300, isRedeemed: true, code: 'BOOK-READ-NOW' }
];

let userStats = {
  streak: 5,
  totalPoints: 850,
  level: 3,
  totalCompleted: 34
};

// Get Challenges
app.get('/challenges', (req, res) => {
  res.json({ challenges, status: 'success' });
});

// Update Challenge Progress (Mock)
app.post('/challenges/:id/progress', (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  const challenge = challenges.find(c => c.id === id);
  if (challenge) {
    challenge.progress = progress;
    if (challenge.progress >= challenge.target) {
      challenge.status = 'completed';
      // Auto-add points
      userStats.totalPoints += challenge.reward;
    }
    res.json({ challenge, userStats, status: 'success' });
  } else {
    res.status(404).json({ error: 'Challenge not found' });
  }
});

// Get Rewards
app.get('/rewards', (req, res) => {
  res.json({ rewards, status: 'success' });
});

// Redeem Reward
app.post('/rewards/redeem', (req, res) => {
  const { rewardId } = req.body;
  const reward = rewards.find(r => r.id === rewardId);

  if (!reward) return res.status(404).json({ error: 'Reward not found' });
  if (reward.isRedeemed) return res.status(400).json({ error: 'Already redeemed' });
  if (userStats.totalPoints < reward.cost) return res.status(400).json({ error: 'Insufficient points' });

  reward.isRedeemed = true;
  userStats.totalPoints -= reward.cost;

  res.json({ reward, userStats, status: 'success' });
});

// Get User Stats
app.get('/user/stats', (req, res) => {
  res.json({ stats: userStats, status: 'success' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 NeuroPilot AI Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/ask`);
  console.log(`🔍 Task analysis: http://localhost:${PORT}/analyze-task`);
  console.log(`📧 Email replies: http://localhost:${PORT}/generate-email-reply`);
  console.log(`📅 Calendar endpoints: http://localhost:${PORT}/calendar/*`);
});

export default app;