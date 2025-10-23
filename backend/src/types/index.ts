import { Request } from 'express';

/**
 * 인증된 사용자 정보가 포함된 확장 Express Request
 */
export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * JWT 페이로드 구조
 */
export interface JwtPayload {
  userId: string;
  username: string;
}

/**
 * OpenAI 메시지 형식
 */
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * API 응답 래퍼
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}



