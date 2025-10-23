import apiClient from './api-client';
import { API_ENDPOINTS } from '@/config/constants';
import { Message, SendMessageInput, SendMessageResponse, ApiResponse } from '@/types';

/**
 * 채팅 서비스
 * 메시지 전송 및 조회 처리
 */
export const chatService = {
  /**
   * 캐릭터의 모든 메시지 조회
   */
  async getMessages(characterId: string): Promise<Message[]> {
    const response = await apiClient.get<ApiResponse<Message[]>>(
      API_ENDPOINTS.MESSAGES_BY_CHARACTER(characterId)
    );
    return response.data.data!;
  },

  /**
   * 메시지 전송 및 AI 응답 받기
   */
  async sendMessage(input: SendMessageInput): Promise<SendMessageResponse> {
    const response = await apiClient.post<ApiResponse<SendMessageResponse>>(
      API_ENDPOINTS.SEND_MESSAGE,
      input
    );
    return response.data.data!;
  },
};



