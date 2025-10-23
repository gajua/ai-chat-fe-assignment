/**
 * 애플리케이션 상수 및 설정
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  // 인증
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  ME: '/api/auth/me',
  
  // 캐릭터
  CHARACTERS: '/api/characters',
  CHARACTER_BY_ID: (id: string) => `/api/characters/${id}`,
  
  // 채팅
  MESSAGES_BY_CHARACTER: (characterId: string) => `/api/chat/messages/${characterId}`,
  SEND_MESSAGE: '/api/chat/messages',
} as const;

export const MESSAGE_MAX_LENGTH = 200;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  SELECTED_CHARACTER: 'selected_character',
} as const;

// 기능 플래그
export const FEATURE_FLAGS = {
  DARK_MODE: true,  // ✅ 다크모드 구현 완료
  OFFLINE_MODE: false,
  TAB_SYNC: false,
  INFINITE_SCROLL: false,
} as const;
