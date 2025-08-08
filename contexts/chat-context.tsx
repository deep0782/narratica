'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { ChatMessage } from '@/lib/chat-service';

interface ChatState {
  sessions: {
    [sessionId: string]: {
      messages: ChatMessage[];
      lastUpdated: number;
    };
  };
  currentSessionId: string | null;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; sessionId: string; message: ChatMessage }
  | { type: 'SET_SESSION'; sessionId: string; messages: ChatMessage[] }
  | { type: 'SET_CURRENT_SESSION'; sessionId: string }
  | { type: 'CLEAR_SESSION'; sessionId: string };

interface ChatContextType {
  state: ChatState;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  setSession: (sessionId: string, messages: ChatMessage[]) => void;
  setCurrentSession: (sessionId: string) => void;
  clearSession: (sessionId: string) => void;
  getCurrentSession: () => { messages: ChatMessage[]; lastUpdated: number } | null;
}

const initialState: ChatState = {
  sessions: {},
  currentSessionId: null
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.sessionId]: {
            messages: [
              ...(state.sessions[action.sessionId]?.messages || []),
              action.message
            ],
            lastUpdated: Date.now()
          }
        }
      };
    
    case 'SET_SESSION':
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.sessionId]: {
            messages: action.messages,
            lastUpdated: Date.now()
          }
        }
      };
    
    case 'SET_CURRENT_SESSION':
      return {
        ...state,
        currentSessionId: action.sessionId
      };
    
    case 'CLEAR_SESSION':
      const { [action.sessionId]: _, ...remainingSessions } = state.sessions;
      return {
        ...state,
        sessions: remainingSessions,
        currentSessionId: state.currentSessionId === action.sessionId 
          ? null 
          : state.currentSessionId
      };
  }
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const addMessage = (sessionId: string, message: ChatMessage) => {
    dispatch({ type: 'ADD_MESSAGE', sessionId, message });
  };

  const setSession = (sessionId: string, messages: ChatMessage[]) => {
    dispatch({ type: 'SET_SESSION', sessionId, messages });
  };

  const setCurrentSession = (sessionId: string) => {
    dispatch({ type: 'SET_CURRENT_SESSION', sessionId });
  };

  const clearSession = (sessionId: string) => {
    dispatch({ type: 'CLEAR_SESSION', sessionId });
  };

  const getCurrentSession = () => {
    if (!state.currentSessionId) return null;
    return state.sessions[state.currentSessionId] || null;
  };

  return (
    <ChatContext.Provider 
      value={{
        state,
        addMessage,
        setSession,
        setCurrentSession,
        clearSession,
        getCurrentSession
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
