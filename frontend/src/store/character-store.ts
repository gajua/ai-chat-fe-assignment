import { create } from 'zustand';
import { Character, CreateCharacterInput, UpdateCharacterInput } from '@/types';
import { characterService } from '@/services/character-service';

/**
 * 캐릭터 스토어
 * AI 캐릭터 상태 관리
 */
interface CharacterState {
  characters: Character[];
  selectedCharacter: Character | null;
  isLoading: boolean;
  error: string | null;
  
  // 액션
  fetchCharacters: () => Promise<void>;
  selectCharacter: (character: Character) => void;
  createCharacter: (input: CreateCharacterInput) => Promise<Character>;
  updateCharacter: (id: string, input: UpdateCharacterInput) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: [],
  selectedCharacter: null,
  isLoading: false,
  error: null,

  fetchCharacters: async () => {
    set({ isLoading: true, error: null });
    try {
      const characters = await characterService.getAll();
      set({ characters, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : '캐릭터 조회에 실패했습니다';
      set({ error: message, isLoading: false });
    }
  },

  selectCharacter: (character: Character) => {
    set({ selectedCharacter: character });
  },

  createCharacter: async (input: CreateCharacterInput) => {
    set({ isLoading: true, error: null });
    try {
      const newCharacter = await characterService.create(input);
      const characters = [...get().characters, newCharacter];
      set({ characters, isLoading: false });
      return newCharacter;
    } catch (error) {
      const message = error instanceof Error ? error.message : '캐릭터 생성에 실패했습니다';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateCharacter: async (id: string, input: UpdateCharacterInput) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCharacter = await characterService.update(id, input);
      const characters = get().characters.map((char) =>
        char.id === id ? updatedCharacter : char
      );
      set({ characters, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : '캐릭터 수정에 실패했습니다';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteCharacter: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await characterService.delete(id);
      const characters = get().characters.filter((char) => char.id !== id);
      set({ characters, isLoading: false });
      
      // 삭제된 캐릭터가 선택된 캐릭터였다면 초기화
      if (get().selectedCharacter?.id === id) {
        set({ selectedCharacter: null });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '캐릭터 삭제에 실패했습니다';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));






