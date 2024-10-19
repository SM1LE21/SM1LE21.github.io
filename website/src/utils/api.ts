// TK CHAT INTEGRATION
import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8000'; // for development
const API_BASE_URL = 'https://widgethoster.sytes.net/tkchat'; // for production


export interface SessionData {
  session_id: string;
  created_at: string;
  last_active: string;
  is_active: number;
}

export interface FunctionCall {
  name: string;
  arguments: any;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content?: string;
  function_call?: {
    name: string;
    arguments: any;
  };
}

export interface Config {
  showFeedback: boolean; // TODO: currently unused
}

export const initializeSession = async (): Promise<SessionData> => {
  const response = await axios.post<SessionData>(`${API_BASE_URL}/session/initialize_session`);
  return response.data;
};

export const sendMessage = async (sessionId: string, message: string): Promise<Message> => {
  const response = await axios.post<Message>(`${API_BASE_URL}/chat/`, {
    session_id: sessionId,
    role: 'user',
    content: message,
  });
  return response.data;
};

export const submitFeedback = async (sessionId: string, feedback: string): Promise<void> => {
  await axios.post(`${API_BASE_URL}/feedback/`, {
    session_id: sessionId,
    feedback: feedback,
  });
};

export const getConfig = async (): Promise<Config> => {
  const response = await axios.get<Config>(`${API_BASE_URL}/config`);
  return response.data;
};
