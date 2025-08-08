export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatResponse {
  id: string;
  message: {
      content: string;
      role: string;
    };
  created: number;
}

export interface StoredChat {
  sessionId: string;
  messages: ChatMessage[];
  lastUpdated: number;
}

export interface ChatCompletionOptions {
  maxTokens?: number;
  temperature?: number;
  sessionPrefix?: string;
}

const defaultOptions: ChatCompletionOptions = {
  maxTokens: 1000,
  temperature: 0.7,
  sessionPrefix: 'narratica'
}

export class ChatService {
  private static instance: ChatService;
  private readonly apiKey: string;

  private constructor() {
    this.apiKey = process.env.TOGETHER_API_KEY || '';
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public async createChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<{ success: boolean; sessionId: string; error?: string; message?: string }> {

    const { maxTokens, temperature, sessionPrefix } = { ...defaultOptions, ...options };
    const sessionId = `${sessionPrefix}_${Date.now()}`;

    try {
      const response = await fetch('/api/chat-completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages,
          maxTokens,
          temperature,
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: ChatResponse = await response.json();

      // Store chat session
      const chatSession: StoredChat = {
        sessionId,
        messages: [
          ...messages,
          {
            role: "assistant",
            content: data.message.content
          }
        ],
        lastUpdated: Date.now()
      };

      this.storeChatSession(chatSession);

      return { success: true, sessionId, message: data.message.content };
    } catch (error) {
      console.error('Error in chat completion:', error);
      return { 
        success: false, 
        sessionId,
        message: '',
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      };
    }
  }

  public getChatSession(sessionId: string): StoredChat | null {
    try {
      const session = localStorage.getItem(`${sessionId}_chat_session`);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error retrieving chat session:', error);
      return null;
    }
  }

  private storeChatSession(chatSession: StoredChat): void {
    try {
      localStorage.setItem(
        `${chatSession.sessionId}_chat_session`,
        JSON.stringify(chatSession)
      );
    } catch (error) {
      console.error('Error storing chat session:', error);
    }
  }

  public clearChatSession(sessionId: string): void {
    try {
      localStorage.removeItem(`${sessionId}_chat_session`);
    } catch (error) {
      console.error('Error clearing chat session:', error);
    }
  }
}

// Helper function to create system message
export const createSystemMessage = (content: string): ChatMessage => ({
  role: "system",
  content
});

// Helper function to create user message
export const createUserMessage = (content: string): ChatMessage => ({
  role: "user",
  content
});
