import apiClient from './api-client';
import { API_ENDPOINTS } from '@/config/constants';
import {
  Character,
  CreateCharacterInput,
  UpdateCharacterInput,
  ApiResponse,
} from '@/types';

/**
 * 캐릭터 서비스
 * AI 캐릭터에 대한 CRUD 작업 처리
 */
export const characterService = {
  /**
   * 모든 캐릭터 조회
   */
  async getAll(): Promise<Character[]> {
    const response = await apiClient.get<ApiResponse<Character[]>>(
      API_ENDPOINTS.CHARACTERS
    );
    return response.data.data!;
  },

  /**
   * 새 캐릭터 생성
   */
  async create(input: CreateCharacterInput): Promise<Character> {
    const response = await apiClient.post<ApiResponse<Character>>(
      API_ENDPOINTS.CHARACTERS,
      input
    );
    return response.data.data!;
  },

  /**
   * 캐릭터 수정
   */
  async update(id: string, input: UpdateCharacterInput): Promise<Character> {
    const response = await apiClient.put<ApiResponse<Character>>(
      API_ENDPOINTS.CHARACTER_BY_ID(id),
      input
    );
    return response.data.data!;
  },

  /**
   * 캐릭터 삭제
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CHARACTER_BY_ID(id));
  },
};



