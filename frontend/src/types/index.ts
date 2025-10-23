/**
 * 애플리케이션 타입 정의
 */

export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface Character {
  id: string;
  name: string;
  prompt: string;
  thumbnail?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

export interface ChatState {
  characterId: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CreateCharacterInput {
  name: string;
  prompt: string;
  thumbnail?: string;
}

export interface UpdateCharacterInput {
  name?: string;
  prompt?: string;
  thumbnail?: string;
}

export interface SendMessageInput {
  content: string;
  characterId: string;
}

export interface SendMessageResponse {
  userMessage: Message;
  aiMessage: Message;
}
