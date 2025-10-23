import apiClient from './api-client';
import { API_ENDPOINTS } from '@/config/constants';
import { User, LoginCredentials, ApiResponse } from '@/types';

/**
 * 인증 서비스
 * 로그인, 로그아웃, 사용자 세션 처리
 */
export const authService = {
  /**
   * 사용자명과 비밀번호로 로그인
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data.data!;
  },

  /**
   * 현재 사용자 로그아웃
   */
  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.LOGOUT);
  },

  /**
   * 현재 인증된 사용자 조회
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.ME);
    return response.data.data!;
  },
};



