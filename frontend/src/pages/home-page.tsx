import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useCharacterStore } from '@/store/character-store';
import { CharacterList } from '@/components/character-list';
import { CharacterEditor } from '@/components/character-editor';
import { Header } from '@/components/header';

/**
 * 홈 페이지 컴포넌트
 * 캐릭터 목록 표시 및 캐릭터 생성 기능
 */
export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { characters, fetchCharacters, selectCharacter } = useCharacterStore();

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  const handleCharacterSelect = (characterId: string) => {
    const character = characters.find((c) => c.id === characterId);
    if (character) {
      selectCharacter(character);
      navigate(`/chat/${characterId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 pt-8 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">안녕하세요, {user?.username}님! 👋</h1>
          <p className="text-base text-gray-600 dark:text-gray-400">대화하고 싶은 AI 캐릭터를 선택하거나 새로운 캐릭터를 만들어보세요.</p>
        </div>

        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">AI 캐릭터</h2>
          </div>
          
          <CharacterList
            characters={characters}
            onSelect={handleCharacterSelect}
          />
        </div>

        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">새 캐릭터 만들기</h2>
          </div>
          
          <CharacterEditor />
        </div>

      </main>
    </div>
  );
}
