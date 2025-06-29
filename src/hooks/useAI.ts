import { useState } from 'react';
import { Task } from '../types';
import { generateTaskInsights, generateChatResponse, generateEmailReply } from '../services/aiService';

export function useAI() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processNaturalLanguageTask = async (input: string): Promise<Task> => {
    setIsProcessing(true);
    
    try {
      const analysis = await generateTaskInsights(input);
      
      const task: Task = {
        id: Date.now().toString(),
        title: analysis.title,
        description: analysis.description,
        priority: analysis.priority,
        status: 'pending',
        estimatedTime: analysis.estimatedTime,
        tags: analysis.tags,
        category: analysis.category,
        createdAt: new Date(),
        dueDate: analysis.dueDate ? new Date(analysis.dueDate) : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        isAIGenerated: true
      };

      setIsProcessing(false);
      return task;
    } catch (error) {
      console.error('Error processing task:', error);
      setIsProcessing(false);
      throw error;
    }
  };

  const generateChatResponseAI = async (message: string, context?: any): Promise<string> => {
    setIsProcessing(true);
    
    try {
      const response = await generateChatResponse(message, context);
      setIsProcessing(false);
      return response;
    } catch (error) {
      console.error('Error generating chat response:', error);
      setIsProcessing(false);
      throw error;
    }
  };

  const generateEmailReplyAI = async (emailContent: string, context: string): Promise<string> => {
    setIsProcessing(true);
    
    try {
      const reply = await generateEmailReply(emailContent, context);
      setIsProcessing(false);
      return reply;
    } catch (error) {
      console.error('Error generating email reply:', error);
      setIsProcessing(false);
      throw error;
    }
  };

  return {
    processNaturalLanguageTask,
    generateChatResponse: generateChatResponseAI,
    generateEmailReply: generateEmailReplyAI,
    isProcessing
  };
}