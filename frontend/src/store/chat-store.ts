import { create } from 'zustand';
import { Message } from '@/types';
import { chatService } from '@/services/chat-service';

/**
 * 채팅 스토어
 * 채팅 메시지 및 상태 관리
 */
interface ChatState {
  // characterId별 메시지 매핑
  messagesByCharacter: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  
  // 액션
  fetchMessages: (characterId: string) => Promise<void>;
  sendMessage: (characterId: string, content: string) => Promise<void>;
  clearMessages: (characterId: string) => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messagesByCharacter: {},
  isLoading: false,
  error: null,

  fetchMessages: async (characterId: string) => {
    set({ isLoading: true, error: null });
    try {
      const messages = await chatService.getMessages(characterId);
      set((state) => ({
        messagesByCharacter: {
          ...state.messagesByCharacter,
          [characterId]: messages,
        },
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : '메시지 조회에 실패했습니다';
      set({ error: message, isLoading: false });
    }
  },

  sendMessage: async (characterId: string, content: string) => {
    // 사용자 메시지를 즉시 UI에 추가 (Optimistic UI)
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const currentMessages = state.messagesByCharacter[characterId] || [];
      return {
        messagesByCharacter: {
          ...state.messagesByCharacter,
          [characterId]: [...currentMessages, tempUserMessage],
        },
        isLoading: true,
        error: null,
      };
    });

    try {
      const { userMessage, aiMessage } = await chatService.sendMessage({
        content,
        characterId,
      });

      // 임시 메시지를 실제 메시지로 교체하고 AI 메시지 추가
      set((state) => {
        const currentMessages = state.messagesByCharacter[characterId] || [];
        // 임시 메시지 제거하고 실제 메시지들로 교체
        const withoutTemp = currentMessages.filter(msg => msg.id !== tempUserMessage.id);
        return {
          messagesByCharacter: {
            ...state.messagesByCharacter,
            [characterId]: [...withoutTemp, userMessage, aiMessage],
          },
          isLoading: false,
        };
      });
    } catch (error) {
      // 에러 발생 시 임시 메시지 제거
      set((state) => {
        const currentMessages = state.messagesByCharacter[characterId] || [];
        const withoutTemp = currentMessages.filter(msg => msg.id !== tempUserMessage.id);
        const message = error instanceof Error ? error.message : '메시지 전송에 실패했습니다';
        return {
          messagesByCharacter: {
            ...state.messagesByCharacter,
            [characterId]: withoutTemp,
          },
          error: message,
          isLoading: false,
        };
      });
      throw error;
    }
  },

  clearMessages: (characterId: string) => {
    set((state) => {
      const newMessagesByCharacter = { ...state.messagesByCharacter };
      delete newMessagesByCharacter[characterId];
      return { messagesByCharacter: newMessagesByCharacter };
    });
  },

  clearError: () => set({ error: null }),
}));






